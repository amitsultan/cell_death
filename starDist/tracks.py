import matplotlib.pylab as plt
from matplotlib.patches import Circle
from node import Node, list_to_nodes, nodes_distance


def tracks_from_points(points, window=1):
    relevant_marks = []
    tracks = {}
    track_id = 0
    frame = 0
    if len(points) == 0:
        return tracks
    for mark in points[0]:
        tmp = Node(mark, frame)
        relevant_marks.append(tmp)
        tracks[track_id] = tmp
        track_id += 1
    frame += 1
    for point in points[1:]:
        window_marks = list_to_nodes(point, frame)
        for i in range(len(relevant_marks)):
            if len(window_marks) == 0:
                break
            relevant_mark = relevant_marks[i]
            window_marks.sort(key=lambda mark: nodes_distance(mark, relevant_mark))
            if nodes_distance(window_marks[0], relevant_mark) <= 20:  # distance small enough
                mark_node = window_marks.pop(0)
                relevant_mark.set_next(mark_node)
                relevant_marks[i] = mark_node
        for remain_mark in window_marks:
            tmp = remain_mark
            relevant_marks.append(tmp)
            tracks[track_id] = tmp
            track_id += 1
        frame += 1
    return tracks

def get_marks_from_track(tracks, frame):
    arr_list = []
    for key in tracks.keys():
        if tracks[key].frame == frame:
            arr_list.append(tracks[key])
    return arr_list

def draw_circles_on_images_plt(image, marks_list, color='Red'):
    list_points = []
    for mark in marks_list:
        if isinstance(mark, Node):
            list_points.append(mark.data)
        else:
            list_points.append(mark)
    fig,ax = plt.subplots(1, figsize=(20, 12))
    ax.set_aspect('equal')

    # Show the image
    ax.imshow(image)

    # Now, loop through coord arrays, and create a circle at each x,y pair
    for xx,yy in list_points:
        circ = Circle((yy,xx),5, color=color)
        ax.add_patch(circ)