I = imread('E:/pics/1.jpg','jpeg');
bw = im2bw(I, graythresh(I));
bw=~bw;
bw = imfill(bw, 'holes');  %filling holes 
bw = imclearborder(bw, 4);  % remove uncomplete objects which are on border
[B,L] = bwboundaries(bw,'noholes');

% Display the label matrix and draw each boundary
imshow(label2rgb(L, @jet, [.5 .5 .5]))
%hold on
for k = 1:length(B)
  boundary = B{k};
  %plot(boundary(:,2),boundary(:,1), 'w', 'LineWidth', 2)
end

stats = regionprops(L,'Area','Centroid','BoundingBox','Image');

threshold = 0.94;

% loop over the boundaries
%imbox=bw;
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
   result(k,1)=max(boxes(3),boxes(4));
   result(k,2)=area;
   len(k,1)=boxes(3);
   len(k,2)=boxes(4);
   %plot(xx, boxes(2), 'w', 'LineWidth', 2)
   %text(centroid(1),centroid(2),area_string,'Color','black','FontSize',7,'FontWeight','bold');
   
   
  %text(boundary(1,2)-35,boundary(1,1)+13,area_string,'Color','black','FontSize',7,'FontWeight','bold');
  
end
sarandmesh=0.2; % this variable determine the mesh of sarand in CM
ss=sum(len,1)/k;
lenstring=sprintf('length of x=%2.2f and length of y=%2.2f',len(1,1)*0.008506,len(1,2)*0.009024);
title(lenstring);
maxsize=max(result(:,1)); %find maximum of size first column of result 
minsize=min(result(:,1));

wholearea=sum(result(:,2));

%n=3;
%i=minsize:round((maxsize-minsize)/10):maxsize 
%bbbb=result(find([result(find([result(:,1)]>=i(n)),1)]<=i(n+1)),1);
%bbbb=result(find([result(find([result(:,1)]>=i(n)),1)]<=i(n+1)),2);

%n=4;
%i=minsize:round((maxsize-minsize)/10):maxsize 
%bbbb=sum(result(find([result(:,1)]<=i(n)),2));
%bbbb=result(find([result(find([result(:,1)]>=i(n)),1)]<=i(n+1)),2);

n=1
for i=minsize:(maxsize-minsize)/10:maxsize 
   bbbb(n,1)=round(i);
   bbbb(n,2)=sum(result(find([result(:,1)]<=i),2));
   n=n+1;
end
%bar(bbbb(:,1),bbbb(:,2));
figure,hist(result(:,1));
