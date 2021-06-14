import os, sys
from PIL import Image

def tif_to_png(input_path, output_path):
    for infile in os.listdir(input_path):
        print ("file : " + infile)
        if infile[-3:] == "tif":
            outfile = infile[:-3] + "png"
            im = Image.open(input_path + '\\' + infile)
            im = im.convert("RGB")
            print("new filename : " + outfile)
            im.save(output_path + outfile, "PNG")

tif_to_png(sys.argv[1], sys.argv[2])