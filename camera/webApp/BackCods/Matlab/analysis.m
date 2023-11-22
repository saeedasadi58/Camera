function [Dstr] = analysis()

	calibcoeff = 1.6465443131886002
	%button='Yes';
	%while strcmp(button,'Yes')
	% clear;
	%fname = input('Enter picture file name (with extension [.jpg and ...]): ', 's');
	fname = 'IMG.jpg'

	I = imread(fname,'jpg');
	%I = imread('E:/pics/21.jpg','jpeg');
	%I=imadjust(rgb2gray(I));  %adjust the contrast of image
	bw = im2bw(I, graythresh(I));
	%figure,imshow(I);
	% imtool(rgb2gray(I)),imtool(J);
	bw=~bw;
	bw = imfill(bw, 'holes');  %filling holes
	bw = imclearborder(bw, 4);  % remove uncomplete objects which are on border
	% remove all object containing fewer than 30 pixels
	bw = bwareaopen(bw,20);

	%% spliting part
	% %####################### this part design for split particles ###########
	% D = bwdist(~bw,'chessboard');
	%    %F=imregionalmax(D);
	%    %F = im2bw(D, graythresh(D));
	%    %figure, imshow(F,[]);
	%    %figure, imshow(D,[]), title('Distance transform of ~bw');
	% D = -D;
	% D(~bw) = -Inf;
	% L = watershed(D);
	% bw = im2bw(L,1);
	%%
	%########################################################################

	% imshow(bw);
    imwrite(bw, 'bw.png');
    outputImg = 'bw.png';

	[B,L] = bwboundaries(bw,'noholes');

	% Display the label matrix and draw each boundary
	%imshow(label2rgb(L, @jet, [.5 .5 .5]))
	%hold on

	N=length(B) % N= number of particles

	for k = 1:N
	boundary = B{k};
	%plot(boundary(:,2),boundary(:,1), 'w', 'LineWidth', 2)
	end

	stats = regionprops(L,'Area','Centroid','BoundingBox','Image');

	%threshold = 0.94;

	% loop over the boundaries
	%imbox=bw;
	for k = 1:N

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
	result(k,1)=max(boxes(3),boxes(4));  % the geometry mean of box lenghtes
	result(k,2)=area;
	result(k,3)=sqrt(boxes(3)*boxes(4));  % the geometry mean of box lenghtes
	result(k,4)=result(k,3)*area;
	len(k,1)=boxes(3);
	len(k,2)=boxes(4);
	%plot(xx, boxes(2), 'w', 'LineWidth', 2)
	%text(centroid(1),centroid(2),area_string,'Color','black','FontSize',7,'FontWeight','bold');


	%text(boundary(1,2)-35,boundary(1,1)+13,area_string,'Color','black','FontSize',7,'FontWeight','bold');

	end
	% sarandmesh=0.2; % this variable determine the mesh of sarand in CM
	% ss=sum(len,1)/k;
	% lenstring=sprintf('length of x=%2.2f and length of y=%2.2f',len(1,1)*0.008506,len(1,2)*0.009024);
	% title(lenstring);
	maxsize=max(result(:,3)); %find maximum of size first column of result (major axis of boundary box)
	minsize=min(result(:,3));

	wholevolume=sum(result(:,4));


	sortres=sortrows(result);
	for k=1:N
		persentres(k,1)=sortres(k,3);
		persentres(k,2)=(sum(sortres(1:k,4))/wholevolume)*100;
	end

	n=1;
	for i=minsize:(maxsize-minsize)/10:maxsize
	bbbb(n,1)=round(i);
	bbbb(n,2)=(sum(result(find([result(:,3)]<=i),4))/wholevolume)*100;
	n=n+1;
	end

	D80=bbbb(min(find([bbbb(:,2)]>=80)),1)*calibcoeff;
	D50=bbbb(min(find([bbbb(:,2)]>=50)),1)*calibcoeff;
	D40=bbbb(min(find([bbbb(:,2)]>=40)),1)*calibcoeff;
	D20=bbbb(min(find([bbbb(:,2)]>=20)),1)*calibcoeff;


	Dstr=sprintf('D80 =%3.1f \nD50 =%3.1f \nD40 =%3.1f \nD20 =%3.1f\n',D80,D50,D40,D20);


	% figure,plot(persentres(:,1),persentres(:,2));
	%hold on;
	%figure,hist(0);
	hold on;
	%% fitting curve
	%################  fitting curve #################################
	% s = fitoptions('Method','NonlinearLeastSquares',...
	%                'Lower',[0,0],...
	%                'Upper',[Inf,max(persentres(:,1))],...
	%                'Startpoint',[0 0]);
	% f = fittype('a*(x-b)^n','problem','n','options',s);
	% [c2,gof2] = fit(persentres(:,1),persentres(:,2),f,'problem',2);
	% plot(c2,'m');
	% hold off;
	%##################################################################
	%%
	figure,stairs(bbbb(:,1)*calibcoeff,bbbb(:,2));
	grid;xlabel('Size (mm)');ylabel('Percent (%)');
	% hold on;
	text((maxsize-2*(bbbb(2,1)-bbbb(1,1)))*calibcoeff,20,...
		[Dstr],...
		'HorizontalAlignment','center',...
		'BackgroundColor',[1 1 1]);
	%text(maxsize-2*(bbbb(2,1)-bbbb(1,1)),50,Dstr);
	hold off;
    imageFilename = 'output_figure.png'
	saveas(gcf, imageFilename);

    %button = questdlg('Do you have another picture?','','Yes','No','Yes');

end