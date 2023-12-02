function [outs] = ca_sarand()

    particleSize = [4.0;11.2;19.0;38.2];
    percent = [0.0;24.92;61.4522;96.426];
     
    fh=figure('visible','on');
    set(fh,'visible','on');
    plot(particleSize,percent,'LineWidth',1.5);      
    hold on;
     
    ss = fitoptions('Method','NonlinearLeastSquares','Lower',[0,0],'Upper',[Inf,inf],'Startpoint',[1 1]);
    
    ff = fittype('100*(1-exp(-(x/xc)^n))','options',ss);
    
    [c2,gof2] = fit(particleSize,percent,ff);
    
    parSize=0:max(particleSize);
    plot(parSize,100.*(1-exp(-(parSize./c2.xc).^c2.n)),'-r','LineWidth',1.5);
    
            
    %the last 2 item in sizingres are the n and xc coefficients
    nc=c2.n;
    xc=c2.xc;

    outs=sprintf('nc=%3.1f;xc=%3.1f',nc,xc);

    xlabel('Size(mm)');
    ylabel('Percent(%)');

    %title('Sizing Graph with Fitted Curve');
    %text(max(particleSize)*0.1,max(percent)*0.8,xcnstring);
    %legend off;
end