function [px2mm, bw2, outputImg] = calibration()
    fname = 'IMG.jpg'
    dimensionofball = 4
    I = imread(fname,'jpeg');
    I=imadjust(rgb2gray(I));  %adjust the contrast of image

    bw = im2bw(I, graythresh(I));
    bw=~bw;
    bw = imclearborder(bw, 4);  % remove uncomplete objects which are on border

    bw = bwareaopen(bw,20);
    se = strel('disk',2);
    bw = imclose(bw,se);
    bw = imfill(bw,'holes');

    [B,L] = bwboundaries(bw,'noholes');

    for k = 1:length(B)
      boundary = B{k};
    end

    stats = regionprops(L,'Area','Centroid','BoundingBox');

    threshold = 0.5;

    j=1;
    for k = 1:length(B)

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

      if metric > threshold
        centroid = stats(k).Centroid;
        c(j)=centroid(1);
        r(j)=centroid(2);
        numm(j)=k;
        j=j+1;
        %plot(centroid(1),centroid(2),'ko');
      end


    end
    bw2 = bwselect(bw,c,r,4);
    imwrite(bw2, 'bw2.png');
    outputImg = 'bw2.png';
    for kk = 1:length(numm)
      rad(kk,:)=stats(numm(kk)).BoundingBox;
    end

    px2mm=dimensionofball/(sum(sqrt(rad(:,3).*rad(:,4)))/length(numm))