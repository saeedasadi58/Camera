import numpy as np
from skimage.transform import hough_circle, hough_circle_peaks
from skimage.feature import canny  
from skimage.util import img_as_ubyte
from skimage.draw import disk
import cv2

def circle_find(input_pth:str, output_pth:str) -> bool:
     """
     This function find a sphere on a given input image.
     
     :param input_pth: str - The file path to the input image.
     :param output_pth: str - The file path to save the output masked image.
     :return: bool - True if the masked image is saved successfully, False otherwise.
     """
     # Load image and detect edges
     image = img_as_ubyte(cv2.imread(input_pth, 0)) 
     edges = canny(image, sigma=3, low_threshold=10, high_threshold=50)

     # Detect circle radii
     hough_radii = np.arange(20, 35, 2)
     hough_res = hough_circle(edges, hough_radii)

     # Select most prominent circle
     accums, cx, cy, radii = hough_circle_peaks(hough_res, hough_radii, total_num_peaks=1)
     
     # Mask image outside circle
     msk = np.ones((image.shape[0], image.shape[1]), dtype=np.uint8)
     for center_y, center_x, radius in zip(cy, cx, radii):
          yy, xx = disk((center_y, center_x), radius, shape=image.shape)
          msk[yy, xx] = 0

     # Multiply mask by 255
     msk *= 255

     # Save masked image
     stat = cv2.imwrite(output_pth, msk)
  
     return stat