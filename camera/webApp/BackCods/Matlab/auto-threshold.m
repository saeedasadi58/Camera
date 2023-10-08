clear;
I = imread('1.jpg','jpeg');
justsign = uint8(zeros(size(I)));
ithresh = 100;
color = [981,172,126];
thresdist = 15;
dim = size(I(:,:,1));
A = [color;1,0,0;0,1,0];
A(1,:) = A(1,:)/(sqrt(A(1,1)^2+A(1,2)^2+A(1,3)^2));
A(2,:) = A(2,:) - (A(2,:)*A(1,:)')*A(1,:);
A(2,:) = A(2,:)/(sqrt(A(2,1)^2+A(2,2)^2+A(2,3)^2));
A(3,:) = A(3,:) - (A(3,:)*A(1,:)')*A(1,:) - (A(3,:)*A(2,:)')*A(2,:);
A(3,:) = A(3,:)/(sqrt(A(3,1)^2+A(3,2)^2+A(3,3)^2));
for i=1:dim(1)
        for j=1:dim(2)
                temp(1,1,1) = double(I(i,j,1));
                temp(2,1,1) = double(I(i,j,2));
                temp(3,1,1) = double(I(i,j,3));
                intensity = temp(1)+temp(2)+temp(3);
                d = sqrt((temp'*A(2,:)')^2 + (temp'*A(3,:)')^2);
                if (d > thresdist | intensity < ithresh ) justsign(i,j,:) = 155;
        			else justsign(i,j,:) = I(i,j,:);
          		end
end
end
figure(1);
image(justsign);
