import patoolib
import sys
import os

BASE_FOLDER = '../data/'
TRACKMATE_PATH = '../../trackmate/'


# File name must contain either Rar or zip extension
def extractFile(fileName):
    if not os.path.exists(BASE_FOLDER + fileName):
        print('file not found')
        return False
    try:
        fileNameNoExtension = BASE_FOLDER + fileName[0 : len(fileName) - 4]
        os.mkdir(BASE_FOLDER + fileNameNoExtension)
        os.mkdir(BASE_FOLDER + fileNameNoExtension + '/images')
        patoolib.extract_archive(BASE_FOLDER + fileName, outdir=BASE_FOLDER + fileNameNoExtension + '/images')
        return True
    except Exception as e:
        if 'WinError 183' in str(e):
            print('Experiment already exists')
        return False

def main(argv):
    if len(argv) == 0:
        raise Exception('No argument given')
    experiment_rar = argv[0]
    try:
        if extractFile(experiment_rar):
            print('Extracted')
        else:
            return False
    except Exception as e:
        print(e)

if __name__ == "__main__":
    main(sys.argv[1:])
