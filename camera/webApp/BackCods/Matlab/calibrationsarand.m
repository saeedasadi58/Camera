function imageFilename = calibrationsarand()
    fname = 'IMG.jpg'
    I = imread(fname, 'jpeg');
    bw = im2bw(I, graythresh(I));
    bw = imfill(bw, 'holes');  % Filling holes 
    bw = imclearborder(bw, 4);  % Remove incomplete objects on the border
    [B, L] = bwboundaries(bw, 'noholes');

    % Create a figure and display the label matrix with colored boundaries
  
    imshow(label2rgb(L, @jet, [.5 .5 .5]));
    hold on;
    
    stats = regionprops(L, 'Area', 'Centroid', 'BoundingBox');

    threshold = 0.94;

    % Loop over the boundaries
    for k = 1:length(B)
        % Obtain (X, Y) boundary coordinates corresponding to label 'k'
        boundary = B{k};
        
        % Obtain the area calculation corresponding to label 'k'
        area = stats(k).Area;
        boxes = stats(k).BoundingBox;

        % Mark objects above the threshold with a black circle
        centroid = stats(k).Centroid;
        xx = boxes(1):1:boxes(1) + boxes(3);
        yy = boxes(2):1:boxes(2) + boxes(4);
        len(k, 1) = boxes(3);
        len(k, 2) = boxes(4);
    end
    
    sarandmesh = 0.2; % This variable determines the mesh of sarand in CM
    ss = sum(len, 1) / k;
    lenstring = sprintf('Length of x=%2.2f and length of y=%2.2f \n Metric of x=%f and metric of y=%f', ss(1), ss(2), sarandmesh/ss(1), sarandmesh/ss(2));
    title(lenstring);
    imageFilename = 'sarand.png'
	  saveas(gcf, imageFilename);
end
