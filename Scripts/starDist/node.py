import numpy as np


class Node:
    def __init__(self, data, frame):
        # store data
        self.data = data
        self.frame = frame
        # store reference (next item)
        self.next = None
        self.prev = None
        return

    def set_next(self, next_node):
        self.next = next_node
        next_node.prev = self
        
    def set_prev(self, prev_node):
        self.prev = prev_node
        prev_node.next = self

    def __str__(self):
         return "({}, {})".format(self.data[0], self.data[1])
    def __repr__(self):
         return "({}, {})".format(self.data[0], self.data[1])
        
def list_to_nodes(e_lists, frame):
    node_list = []
    for e in e_lists:
        node_list.append(Node(e, frame))
    return node_list

def nodes_distance(p1, p2):
    return np.linalg.norm(p1.data-p2.data)
