import cv2
import csv
import pandas as pd
import glob
import numpy as np
import sys
import starModel as sm
from argparse import ArgumentParser
from node import Node, list_to_nodes, nodes_distance
from tracks import tracks_from_points, get_marks_from_track, draw_circles_on_images_plt

def get_track_details(track, track_id):
    last_node = track
    next_node = track.next
    start_point = track
    
    track_probs = [track.prob]
    track_deltas = []
    track_nodes_count = 1
    
    while(next_node is not None):
        track_deltas.append(nodes_distance(next_node, last_node))
        track_probs.append(next_node.prob)
        track_nodes_count += 1
        last_node = next_node
        next_node = next_node.next
    track_probs = np.array(track_probs)
    track_deltas = np.array(track_deltas)
    json_track = {'track_id': track_id,
                  'start_node': start_point,
                  'delta_mean': np.mean(track_deltas) if len(track_deltas) != 0 else 0,
                  'delta_std': np.std(track_deltas) if len(track_deltas) != 0 else 0,
                  'prob_mean': np.mean(track_probs) if len(track_probs) != 0 else 0,
                  'node_count': track_nodes_count}
    return json_track

def get_multi_tracks_details(tracks):
    tracks_json = []
    for i in range(len(tracks)):
        tracks_json.append(get_track_details(tracks[i], i))
    return tracks_json

def export_csv(df, tracks, output_path, images_length):
    try:
        with open(f'{output_path}', 'w', newline='') as file:
            writer = csv.writer(file)
            writer.writerow(["type", "frame", "x", "y", "id"])
            mark_id = 0
            for frame in range(images_length):
                frame_marks = get_marks_from_track(tracks, frame)
                for mark in frame_marks:
                    mark_color = "1"
                    if mark.prob >= 0.8:
                        mark_color = "1"
                    elif mark.prob >= 0.6:
                        mark_color = "2"
                    else:
                        mark_color = "3"
                    writer.writerow([mark_color, frame, mark.data[1], mark.data[0], mark_id])
                    mark_id += 1
        return True
    except Exception as e:
        print(e)
        return False

def main():
    print("Parsing arguments...")
    parser = ArgumentParser()
    parser.add_argument('images_path')
    parser.add_argument('project_name')
    parser.add_argument('output_path')
    args = parser.parse_args()
    path = args.images_path
    project_name = args.project_name
    output_path = args.output_path
    print("Reading images...")
    pictures_path = glob.glob(path+'/*.png')
    print("Sorting images...")
    pictures_path.sort(key=lambda path: int(path.split('_')[len(path.split('_')) - 1][:-4]))
    images = []
    print("Converting images...")
    for p in pictures_path:
        images.append(np.array(cv2.cvtColor(cv2.imread(p), cv2.COLOR_BGR2RGB)))
    df = pd.DataFrame({"path": pictures_path, "image": images})
    print("initializing Star Model...")
    star = sm.StarModel()
    print("Calculating points...")
    points = star.get_images_points(df['image'].values)
    print("Calculating tracks...")
    tracks = tracks_from_points(points)
    print(tracks)
    print("Exporting results...")
    if export_csv(df, tracks, output_path+f"/{project_name}.csv", len(images)):
        track_details_arr = get_multi_tracks_details(tracks)
        with open(output_path+f"/{project_name}_features.csv", 'w', newline='') as file:
            writer = csv.writer(file)
            writer.writerow(["ID", "x", "y", 'frame','delta_mean','delta_std','prob_mean','track_length'])
            for track_details in track_details_arr:
                id = track_details['track_id']
                x = track_details['start_node'].data[1]
                y = track_details['start_node'].data[0]
                frame = track_details['start_node'].frame
                delta_mean = track_details['delta_mean']
                delta_std = track_details['delta_std']
                prob_mean = delta_mean = track_details['prob_mean']
                track_length = delta_mean = track_details['node_count']
                writer.writerow([id, x, y, frame, delta_mean, delta_std, prob_mean, track_length])
        return 0
    else:
        raise Exception("Failed to export results")

if __name__ == '__main__':
    sys.exit(0 if not main() else 1)
