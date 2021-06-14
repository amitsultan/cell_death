import patoolib
import sys
import os
from functools import cmp_to_key
import re


BASE_FOLDER = '../data/'
TRACKMATE_PATH = '../../trackmate/'


def sort_func(x, y):
    x_last = int(re.sub('[^0-9]','', x.split("_")[-1]))
    y_last = int(re.sub('[^0-9]','', y.split("_")[-1]))
    return x_last - y_last

def fix_files_name(path, extension):
    filelist = os.listdir(path)
    filelist = sorted(filelist, key=cmp_to_key(sort_func))
    for i in range(len(filelist)):
        splited_filename = filelist[i].split("_")
        new_filename = str(splited_filename[0]+extension+"_"+str((i))+".tif")
        os.rename(path+"/"+filelist[i],path+"/"+new_filename)

# File name must contain either Rar or zip extension
def extractFile(fileName, extension):
    if not os.path.exists(BASE_FOLDER + fileName):
        print('file not found')
        return False
    try:
        fileNameNoExtension = BASE_FOLDER + fileName[0 : len(fileName) - 4]
        os.mkdir(BASE_FOLDER + fileNameNoExtension + extension)
        os.mkdir(BASE_FOLDER + fileNameNoExtension + extension + '/images')
        patoolib.extract_archive(BASE_FOLDER + fileName, outdir=BASE_FOLDER + fileNameNoExtension+extension + '/images')
        fix_files_name(BASE_FOLDER + fileNameNoExtension +extension+ '/images', extension)
        return True
    except Exception as e:
        if 'WinError 183' in str(e):
            print('Experiment already exists')
        else:
            print(e)
        return False

def main(argv):
    if len(argv) == 0:
        raise Exception('No argument given')
    experiment_rar = argv[0]
    extension = ''
    if len(argv) == 2:
        extension = argv[1]
    try:
        if extractFile(experiment_rar, extension):
            print('Extracted')
        else:
            return False
    except Exception as e:
        print(e)

if __name__ == "__main__":
    main(sys.argv[1:])
