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


def export_csv(df, tracks, output_path, images_length):
    try:
        with open(f'{output_path}', 'w', newline='') as file:
            writer = csv.writer(file)
            writer.writerow(["type", "frame", "x", "y", "id"])
            mark_id = 0
            for frame in range(images_length):
                frame_marks = get_marks_from_track(tracks, frame)
                for mark in frame_marks:
                    writer.writerow(["1", frame, mark.data[1], mark.data[0], mark_id])
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
	print("Exporting results...")
	if export_csv(df, tracks, output_path+f"/{project_name}.csv", len(images)):
	    print("Done...")
		return 0
	else:
		raise Exception("Failed to export results")

if __name__ == '__main__':
	sys.exit(0 if not main() else 1)
