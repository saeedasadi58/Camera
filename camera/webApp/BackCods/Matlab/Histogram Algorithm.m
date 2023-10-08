%CS223B, Project, Pixel Selection based on a histogram of pixels with a high
%                 gradient

clear;

%Get image number
image_number=input('Please input the image number >');

%path for images
datapath = sprintf('../data');
resultpath = sprintf('../results');

%load pictures
str=sprintf('%s/u%d.pgm', datapath, image_number);
u_image=pgmread(str);

str=sprintf('%s/v%d.pgm', datapath, image_number);
v_image=pgmread(str);

%detect objects
[u_result, u_grad_th] = process_image(u_image, 1);
[v_result, v_grad_th] = process_image(v_image, 2);

%save result images
str=sprintf('%s/u%d.ah.pgm', resultpath, image_number);
pgmwrite(u_result, str);

str=sprintf('%s/v%d.ah.pgm', resultpath, image_number);
pgmwrite(v_result, str);

%construct and save the composite image
[a b]=size(u_result);
str=sprintf('%s/c%d.ah.pgm', resultpath, image_number);
c = [u_result ones(a, 1) v_result;
     ones(1,2*b+1);
     u_grad_th ones(a, 1) v_grad_th];
pgmwrite(c, str);