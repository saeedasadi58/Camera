from pypylon import pylon
import matplotlib.pyplot as plt
from PIL import Image
import os
import glob

from distutils.core import setup
from ctypes import CDLL


#path = 'my_pics'
#path = r'C:\DRO\DCL_rawdata_files'                     # use your path
#file_name = glob.glob(os.path.join(path, "*.jpg"))     # advisable to use os.path.join as this makes concatenation OS independent

def read_camera(file_path):
 while(True):
  tl_factory = pylon.TlFactory.GetInstance()
  devices = tl_factory.EnumerateDevices()
  for device in devices:
      print(device.GetFriendlyName())

  tl_factory = pylon.TlFactory.GetInstance()
  camera = pylon.InstantCamera()
  camera.Attach(tl_factory.CreateFirstDevice())

  camera.Open()
  camera.StartGrabbing(1)
  grab = camera.RetrieveResult(2000, pylon.TimeoutHandling_Return)
  if grab.GrabSucceeded():
      img = grab.GetArray()
      print(f'Size of image: {img.shape}')
  camera.Close()

  im = Image.fromarray(img)

  im.save(file_path)

## Load the DLL
#my_dll = CDLL("read_camera.dll")

## Call the function
#my_dll.read_camera(1, b"output.jpg")




#os.remove(file_name)

read_camera("my_pics")



















"""import numpy as np
import customtkinter
import cv2 as cv
import subprocess
import tkinter

def ana():
 subprocess.call(['analyze.exe'])


customtkinter.set_appearance_mode("dark")
customtkinter.set_default_color_theme("dark-blue")



root = customtkinter.CTk()
root.geometry("1000x1000")

frame = customtkinter.CTkFrame(master=root)
frame.pack(pady = 20,padx = 60 , fill = "both", expand = True)

button_S = customtkinter.CTkButton(master=frame,text="analyze",command=ana)
button_S.pack(pady = 12, padx = 10)
button_S.place(relx=0.1, rely=0.3, anchor=tkinter.CENTER)

root.mainloop()"""

"""cap = cv.VideoCapture()
if not cap.isOpened():
    print("Cannot open camera")
    exit()
while True:
    # Capture frame-by-frame
    ret, frame = cap.read()
    # if frame is read correctly ret is True
    if not ret:
        print("Can't receive frame (stream end?). Exiting ...")
        break
    # Our operations on the frame come here
    gray = cv.cvtColor(frame, cv.COLOR_BGR2GRAY)
    # Display the resulting frame
    cv.imshow('frame', gray)
    if cv.waitKey(1) == ord('q'):
        break
# When everything done, release the capture
cap.release()
cv.destroyAllWindows()"""