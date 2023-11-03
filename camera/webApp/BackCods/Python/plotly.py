import tkinter as tk
# from PIL import Image, ImageTk

import matplotlib.pyplot as plt
import random

from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
from tkinter import *

import time

from pypylon import pylon
import threading

from datetime import datetime
from webApp.models import Proccess

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
image_path = "webApp/static/image/cameraPic.png"  # Replace with the paths to your images


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
        print("------------axs ------------------", random_number_D20)
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
    tl_factory = pylon.TlFactory.GetInstance()
    all_devices = tl_factory.EnumerateDevices()
    devices = []
    for device in all_devices:
        devices.append(device.GetFriendlyName())

    tl_factory = pylon.TlFactory.GetInstance()
    camera = pylon.InstantCamera()
    camera.Attach(tl_factory.CreateFirstDevice())

    camera.Open()
    camera.StartGrabbing(1)
    grab = camera.RetrieveResult(2000, pylon.TimeoutHandling_Return)
    if grab.GrabSucceeded():
        img = grab.GetArray()
        # print(f'Size of image: {img.shape}')
    camera.Close()
    from PIL import Image, ImageTk
    im = Image.fromarray(img)

    im.save(image_path)
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
