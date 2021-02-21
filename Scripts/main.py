import subprocess
import sys


def runTrackmate(path, csv_name):
	# ImageJ-win64
	script_status = subprocess.run('ImageJ-win64 New_.py', 'C:/Users/User/Downloads/test-sytox-green/test-sytox-green_1.tif', 'test-sytox-green.csv')
	print(script_status)


if __name__ == '__main__':
    runTrackmate('C:/Users/User/Downloads/test-sytox-green/test-sytox-green_1.tif','test-sytox-green.csv')


