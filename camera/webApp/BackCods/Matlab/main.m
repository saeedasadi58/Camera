% Specify the image file and the diameter of the ball (in mm)
fname = 'IMG.jpg';
dimensionofball = 12.7;

% Call the function to process the image
% calibration(fname, dimensionofball);
% Call the function to process the image and capture the results
%[px2mm, bw2, outputFilename] = calibration(fname, dimensionofball);

% Now you can use px2mm and bw2 in your main script
%disp(['Pixel-to-Millimeter Conversion Factor: ', num2str(px2mm)]);
% figure, imshow(bw2);

calibration_constant = 20
button = 'Yes'

[N, bw, outputImg, imageFilename] = analyze(fname, calibration_constant, button)
sprintf('D80 =%3.3f \nD50 =%3.3f \n', px2mm, N)

%fig = sarand(fname)