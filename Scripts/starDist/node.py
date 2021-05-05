import numpy as np


class Node:
    def __init__(self, data, frame, prob):
        # store data
        self.data = data
        self.frame = frame
        self.prob = prob
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
        
def list_to_nodes(e_lists, frame, prob_list):
    node_list = []
    for i in range(len(e_lists)):
        node_list.append(Node(e_lists[i], frame, prob_list[i]))
    return node_list

def nodes_distance(p1, p2):
    return np.linalg.norm(p1.data-p2.data)
