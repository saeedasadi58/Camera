import tkinter as tk
# from PIL import Image, ImageTk
import json
import matplotlib.pyplot as plt
import random

from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
from tkinter import *

import time

from pypylon import pylon
import threading

from datetime import datetime
from webApp.models import Proccess, ProccessInfo
import subprocess

# Create the main window
window = tk.Tk()

# Get the window dimensions
window_width = window.winfo_screenwidth()
window_height = window.winfo_screenheight()

# Calculate the dimensions for the image
image_width = window_width // 2
image_height = window_height

# Create a label widget to display the image and place it on the right side
image_label = tk.Label(window)
image_label.place(x=window_width // 2, y=0, anchor=tk.NW)

# List of image paths
image_path = "webApp/static/image/IMG.jpg"  # Replace with the paths to your images


def plotting():
    D20 = []
    D40 = []
    D50 = []
    D80 = []

    # Create Tkinter window
    # root = tk.Tk()
    # root.title("Sizing")

    # Create Matplotlib figure and subplot axes
    fig, axs = plt.subplots(4, 1, figsize=(8, 8))

    # Create Tkinter canvas
    canvas = FigureCanvasTkAgg(fig, master=window)
    # canvas.get_tk_widget().pack()
    canvas.get_tk_widget().grid(row=0, column=10, padx=10, pady=10)  # Modify grid position and padding

    while True:
        random_number_D20 = random.uniform(10, 11.32)
        random_number_D40 = random.uniform(11.35, 13.008)
        random_number_D50 = random.uniform(13.1, 15)
        random_number_D80 = random.uniform(15.2, 16.35)
        Process.objects.create(D20=random_number_D20, D40=random_number_D40, D50=random_number_D50,
                               D80=random_number_D80, start_date=datetime.now())
        # D20.append(random_number_D20)
        # # axs[0].clear()
        # axs[0].plot(D20)
        # axs[0].set_title('D20')
        #
        # D40.append(random_number_D40)
        # # axs[1].clear()
        # axs[1].plot(D40)
        # axs[1].set_title('D40')
        #
        # D50.append(random_number_D50)
        # # axs[2].clear()
        # axs[2].plot(D50)
        # axs[2].set_title('D50')
        #
        # D80.append(random_number_D80)
        # # axs[3].clear()
        # axs[3].plot(D80)
        # axs[3].set_title('D80')
        # Redraw the canvas
        # canvas.draw()

        # from PIL import Image, ImageTk
        # image = Image.open(image_path)
        # resized_image = image.resize((image_width, image_height))
        #
        # # Create a Tkinter-compatible photo image
        # photo = ImageTk.PhotoImage(resized_image)
        #
        # # Update the label with the new image
        # image_label.configure(image=photo)
        # image_label.image = photo  # Keep a reference to prevent garbage collection

        # window.update()

    # window.mainloop()


def read_camera():
    camera = pylon.InstantCamera(pylon.TlFactory.GetInstance().CreateFirstDevice())
    camera.Open()

    # demonstrate some feature access

    with open('webApp/setting.json') as f:
        data = json.load(f)
    gain = data["setting"]["CameraSettings"]["Gain"]
    width = data["setting"]["CameraSettings"]["Width"]
    height = data["setting"]["CameraSettings"]["Height"]
    frame_rate = data["setting"]["CameraSettings"]["FrameRate"]
    pixel_format = data["setting"]["CameraSettings"]["PixelFormat"]

    # Initialize Pylon
    tl_factory = pylon.TlFactory.GetInstance()
    devices = tl_factory.EnumerateDevices()

    for device in devices:
        print(device.GetFriendlyName())

    # camera.ExposureTime.Value = (int(exposure_time))
    # camera.Gain.Value = (int(gain))
    new_width = camera.Width.Value - camera.Width.Inc
    if camera.Width.Value <= int(width):
        # camera.Width.Value = new_width
        camera.Width.SetValue(int(width))

    if camera.Height.Value <= int(height):
        # camera.Width.Value = new_width
        camera.Height.SetValue(int(height))
    # = (int(width))
    # camera.Width.SetValue(int(500))
    # camera.Height.SetValue(int(50))
    camera.GainRaw.SetValue(int(gain))
    # camera.GainRaw.SetValue(int(gain))
    # camera.Height.SetValue(int(50))
    # = (int(height))
    # camera.AcquisitionFrameRateAbs.Value = (frame_rate)
    # camera.PixelFormat.Value = (pixel_format)

    numberOfImagesToGrab = 1
    camera.StartGrabbingMax(numberOfImagesToGrab)

    while camera.IsGrabbing():
        grabResult = camera.RetrieveResult(5000, pylon.TimeoutHandling_ThrowException)

        if grabResult.GrabSucceeded():
            from PIL import Image, ImageTk
            img = grabResult.Array
            im = Image.fromarray(img)

            im.save(image_path)

        grabResult.Release()
    camera.Close()
    return devices


# img = ImageTk.PhotoImage(Image.open("my_pics/my_pic.jpg"))


def reading_camera_continiously():
    # Close the socket
    # sock.close()
    while (True):
        read_camera()
        time.sleep(1)


# reading_camera_continiously()
# plotting()
"""#create_pie_chart()
thread1 = threading.Thread(target=reading_camera_continiously)
thread2 = threading.Thread(target=plotting)
#plotting()

thread1.start()
thread2.start()


thread1.join()
thread2.join()"""
# import matlab.engine

import matlab.engine


def analysis2():
    matlab_script = './webApp/BackCods/Matlab/calibrationsarand.m'

    # Run MATLAB script using subprocess
    # try:
    print("------------axs ------------------")
    eng = matlab.engine.start_matlab()
    print("------------axs ------------------ 2 ")
    button = 'Yes'

    calibration_constant = 12.7
    fname = './IMG.jpg'
    eng.run(matlab_script, nargout=0)
    res = eng.workspace['ans']
    # res2 = eng.result()
    command = f"result = analysis();"

    # output = eng.eval(command, nargout=0)

    # print(f"Output: {output}")

    # output2 = eng.matlab_script()

    print("------------axs ------------------ ", res)
    eng.quit()
    # return (subprocess.run(["matlab", "-r", f"run('{matlab_script}')"]))
    # except subprocess.CalledProcessError as e:
    #     print(f"Error running MATLAB script: {e}")


def calibration():
    matlab_script = './webApp/BackCods/Matlab/calibration.m'
    eng = matlab.engine.start_matlab()
    eng.run(matlab_script, nargout=0)
    res = eng.workspace['ans']
    eng.quit()
    return res


def analysis():
    try:
        print("--------------------", datetime.today().strftime('%Y-%m-%d %H:%M:%S.%f'))
        p_info = ProccessInfo.objects.filter().order_by('-id')
        if p_info[0].run:
            res = []
            matlab_script = './webApp/BackCods/Matlab/analysis.m'
            eng = matlab.engine.start_matlab()
            eng.run(matlab_script, nargout=0, background=True)
            res = eng.workspace['ans']
            res = res.split("\n")
            eng.quit()
            analysised_data = res
            Proccess.objects.create(D20=(analysised_data[3].split("="))[1].replace(" ", ""),
                                    D40=(analysised_data[2].split("="))[1].replace(" ", ""),
                                    D50=(analysised_data[1].split("="))[1].replace(" ", ""),
                                    D80=(analysised_data[0].split("="))[1].replace(" ", ""),
                                    start_date=datetime.today().strftime('%Y-%m-%d %H:%M:%S.%f'))
            print("--------------------", datetime.today().strftime('%Y-%m-%d %H:%M:%S.%f'))
            return res
        else:
            return p_info[0].run
    except:
        return True
