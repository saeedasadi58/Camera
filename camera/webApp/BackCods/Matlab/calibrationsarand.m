I = imread('E:/pics/sarand(calibration).jpg','jpeg');
bw = im2bw(I, graythresh(I));
bw = imfill(bw, 'holes');  %filling holes 
bw = imclearborder(bw, 4);  % remove uncomplete objects which are on border
[B,L] = bwboundaries(bw,'noholes');

% Display the label matrix and draw each boundary
imshow(label2rgb(L, @jet, [.5 .5 .5]))
hold on
for k = 1:length(B)
  boundary = B{k};
  %plot(boundary(:,2),boundary(:,1), 'w', 'LineWidth', 2)
end

stats = regionprops(L,'Area','Centroid','BoundingBox');

threshold = 0.94;

% loop over the boundaries
for k = 1:length(B)

  % obtain (X,Y) boundary coordinates corresponding to label 'k'
  boundary = B{k};
  
   
  % compute a simple estimate of the object's perimeter
  %delta_sq = diff(boundary).^2;    
  %perimeter = sum(sqrt(sum(delta_sq,2)));
  
  % obtain the area calculation corresponding to label 'k'
  area = stats(k).Area;
  boxes=stats(k).BoundingBox;
  
  % compute the roundness metric
  %metric = 4*pi*area/perimeter^2;
  
  % display the results
  area_string = sprintf('%5d',area);

  % mark objects above the threshold with a black circle
  %if metric > threshold
   % centroid = stats(k).Centroid;
   % plot(centroid(1),centroid(2),'ko');
  %end
   centroid = stats(k).Centroid;
   xx=boxes(1):1:boxes(1)+boxes(3);
   yy=boxes(2):1:boxes(2)+boxes(4);
   len(k,1)=boxes(3);
   len(k,2)=boxes(4);
   %plot(xx, boxes(2), 'w', 'LineWidth', 2)
   %text(centroid(1),centroid(2),area_string,'Color','black','FontSize',7,'FontWeight','bold');
   
   
  %text(boundary(1,2)-35,boundary(1,1)+13,area_string,'Color','black','FontSize',7,'FontWeight','bold');
  
end
sarandmesh=0.2; % this variable determine the mesh of sarand in CM
ss=sum(len,1)/k;
lenstring=sprintf('length of x=%2.2f and length of y=%2.2f \n metric of x=%f and metric of y=%f',ss(1),ss(2),sarandmesh/ss(1),sarandmesh/ss(2));
title(lenstring);
   