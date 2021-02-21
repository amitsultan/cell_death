import os
import glob


path = 'C:\\NodeServer\\cell_death\\Scripts\\test-sytox-green\\'
filelist = os.listdir(path)
# glob.glob(path+'*.tif')
filelist.sort()
filelist = sorted(filelist)
print(filelist)
# for f in filelist:
# 	# print(f)
# 	split = f.split('_')
# 	print(split)
# 	# split = split[2].split('.')
# 	# print(split[0])
# 	new_name = '{}test-sytox-green_{}.tif'.format(path, str(int(split[0])-1))
# 	print(new_name)
# 	# os.rename(f,new_name)
