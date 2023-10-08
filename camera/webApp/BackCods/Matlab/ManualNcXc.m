    
     
     particleSize=[4;11.2;19;38.2]
     percent=[0;24.92;61.4522;96.426]
     
          
     fh=figure('visible','on');
     set(fh,'visible','on');
     plot(particleSize,percent,'LineWidth',1.5);
                
     hold on;
     
    ss = fitoptions('Method','NonlinearLeastSquares',...
                    'Lower',[0,0],...
                    'Upper',[Inf,inf],...
                    'Startpoint',[1 1]);
               
           


            ff = fittype('100*(1-exp(-(x/xc)^n))','options',ss);
            [c2,gof2] = fit(particleSize,percent,ff);
            
            parSize=0:max(particleSize);
            plot(parSize,100.*(1-exp(-(parSize./c2.xc).^c2.n)),'-r','LineWidth',1.5);

 

            %the xcoeff=x_experimental/x_byfitting and ncoeff is same as
            %this . these two factor are for rosen rambler calibration
                
            D80=(c2.xc)*(-log(1-80/100))^(1/(c2.n));
            D50=(c2.xc)*(-log(1-50/100))^(1/(c2.n));
            D20=(c2.xc)*(-log(1-20/100))^(1/(c2.n));
            
            %the last 2 item in sizingres are the n and xc coefficients
            nc=c2.n
            xc=c2.xc
            
    xlabel('Size(mm)');
    ylabel('Percent(%)');
    %title('Sizing Graph with Fitted Curve');
    %text(max(particleSize)*0.1,max(percent)*0.8,xcnstring);
    %legend off;
                    
   
    