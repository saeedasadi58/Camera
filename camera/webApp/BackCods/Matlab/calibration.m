function [px2mm, bw2, outputImg] = calibration()
    % Load the image
    fname = 'IMG.jpg'
    dimensionofball = 20
    I = imread(fname,'jpeg');
    I=imadjust(rgb2gray(I));  %adjust the contrast of image

    bw = im2bw(I, graythresh(I));
    bw=~bw;
    %bw = imfill(bw, 'holes');  %filling holes
    bw = imclearborder(bw, 4);  % remove uncomplete objects which are on border


    %dimensionofball=12.7;


    % remove all object containing fewer than 30 pixels
    bw = bwareaopen(bw,20);
    % fill a gap in the pen's cap
    se = strel('disk',2);
    bw = imclose(bw,se);

    % fill any holes, so that regionprops can be used to estimate
    % the area enclosed by each of the boundaries
    bw = imfill(bw,'holes');

    %imshow(bw)

    [B,L] = bwboundaries(bw,'noholes');

    % Display the label matrix and draw each boundary
    %imshow(label2rgb(L, @jet, [.5 .5 .5]))
    %hold on
    for k = 1:length(B)
      boundary = B{k};
      %plot(boundary(:,2),boundary(:,1), 'w', 'LineWidth', 2)
    end

    stats = regionprops(L,'Area','Centroid','BoundingBox');

    threshold = 0.5;

    j=1;
    for k = 1:length(B)

      % obtain (X,Y) boundary coordinates corresponding to label 'k'
      boundary = B{k};

      % compute a simple estimate of the object's perimeter
      delta_sq = diff(boundary).^2;
      perimeter = sum(sqrt(sum(delta_sq,2)));

      % obtain the area calculation corresponding to label 'k'
      area = stats(k).Area;

      % compute the roundness metric
      metric = 4*pi*area/perimeter^2;

      % display the results
      metric_string = sprintf('%2.2f',metric);

      % mark objects above the threshold with a black circle
      if metric > threshold
        centroid = stats(k).Centroid;
        c(j)=centroid(1);
        r(j)=centroid(2);
        numm(j)=k;
        j=j+1;
        %plot(centroid(1),centroid(2),'ko');
      end

      %text(boundary(1,2)-35,boundary(1,1)+13,metric_string,'Color','m','FontSize',14,'FontWeight','bold');

    end
    %boxx=stats(3).BoundingBox;
    %aaa=stats(3).Area;
    %rectangle('Position',boxx);
    bw2 = bwselect(bw,c,r,4);
    % figure, imshow(bw2);
    % figure, imshow(bw2);
    imwrite(bw2, 'bw2.png');
    outputImg = 'bw2.png';
    for kk = 1:length(numm)
      rad(kk,:)=stats(numm(kk)).BoundingBox;
    end

    px2mm=dimensionofball/(sum(sqrt(rad(:,3).*rad(:,4)))/length(numm))
