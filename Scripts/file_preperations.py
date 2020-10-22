import patoolib
import sys
import os
BASE_FOLDER = '../data/'

# File name must contain either Rar or zip extension
def extractFile(fileName):
    try:
        fileNameNoExtension = BASE_FOLDER + fileName[0 : len(fileName) - 4]
        os.mkdir(BASE_FOLDER + fileNameNoExtension)
        os.mkdir(BASE_FOLDER + fileNameNoExtension + '/images')
        patoolib.extract_archive(BASE_FOLDER + fileName, outdir=BASE_FOLDER + fileNameNoExtension + '/images')
        return True
    except:
        return False

def main(argv):
    if len(argv) == 0:
        raise Exception('No argument given')
    experiment_rar = argv[0]
    if extractFile(experiment_rar):
        print('Extracted')
    else:
        print('File not found')


if __name__ == "__main__":
    main(sys.argv[1:])
