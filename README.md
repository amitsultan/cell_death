# cell_death annotation tool using active learning

developers:
Amit Sultan
Yarin Hayun
Haim Reyes
Liat Cohen

The system we developed is a two-phase platform for automating the cell tagging process. The first phase is basic image processing and initial tagging using an existent CNN based tool. As additional preparation for phase two the algorithm will also compute the cells’ routes (i.e. tracks) throughout the image stacks and extract relevant features from them. In the second phase the collection of features will serve as input to a classifier which classifies if the either cell died in the right frame (True positive) or it is an error locating or timing the cell’s death (False positive). 
The model utilizes Active Learning, an iterative learning method that includes the researchers in the model’s learning process. The researchers will tag results with low confidence.
The model will improve at tagging images with more “assistance” it receives, lowering the need for further manual intervention – saving the researcher’s precious time during research. The project is done in collaboration with Michael Overholtzer’s lab at Memorial Sloan Kettering Cancer Center, NY.


