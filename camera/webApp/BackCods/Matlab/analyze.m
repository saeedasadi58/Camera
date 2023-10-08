clear;
I = imread('exp.jpg');
bw = im2bw(I, graythresh(I));
bw = imfill(bw, 'holes');  %filling holes 
%%
%########################################################################

imshow(bw);


[B,L] = bwboundaries(bw,'noholes');
N=length(B); % N= number of particles

for k = 1:N
  boundary = B{k};
  %plot(boundary(:,2),boundary(:,1), 'w', 'LineWidth', 2)
end

stats = regionprops(L,'Area','Centroid','BoundingBox','Image');
for k = 1:N

  % obtain (X,Y) boundary coordinates corresponding to label 'k'
  boundary = B{k};
  
  % obtain the area calculation corresponding to label 'k'
  area = stats(k).Area;
  boxes=stats(k).BoundingBox;
  
  % display the results
  area_string = sprintf('%5d',area);
   result(k,1)=max(boxes(3),boxes(4));
   result(k,2)=area;
   len(k,1)=boxes(3);
   len(k,2)=boxes(4);
  
end
maxsize=max(result(:,1)); %find maximum of size first column of result (major axis of boundary box)
minsize=min(result(:,1));

wholearea=sum(result(:,2));


sortres=sortrows(result);
for k=1:N
    persentres(k,1)=sortres(k,1);
    persentres(k,2)=(sum(sortres(1:k,2))/wholearea)*100;
end

n=1;
for i=minsize:(maxsize-minsize)/10:maxsize 
   bbbb(n,1)=round(i);
   bbbb(n,2)=(sum(result(find([result(:,1)]<=i),2))/wholearea)*100;
   n=n+1;
end

D80=bbbb(min(find([bbbb(:,2)]>=80)),1);
D50=bbbb(min(find([bbbb(:,2)]>=50)),1);
D40=bbbb(min(find([bbbb(:,2)]>=40)),1);
D20=bbbb(min(find([bbbb(:,2)]>=20)),1);


Dstr=sprintf('D80 =%2d \nD50 =%2d \nD40 =%2d \nD20 =%2d\n',D80,D50,D40,D20);

hold on;
%%
figure,stairs(bbbb(:,1),bbbb(:,2));
grid;xlabel('Size (px)');ylabel('Percent (%)');
hold on;
text(maxsize-2*(bbbb(2,1)-bbbb(1,1)),20,...
	[Dstr],...
	'HorizontalAlignment','center',... 
	'BackgroundColor',[1 1 1]);
hold off;

