import cv2
import sys
import os
def opn():
    root = 'C:\\Users\\Shashank\\Desktop\\test\\upload\\Case-'  # change 'C:\\Users\\Shashank\\Desktop\\test\\upload\' part to your directory to store images
    
    face_cascade=cv2.CascadeClassifier("C:\\users\\Shashank\\AppData\\Local\\Programs\\Python\\Python36-32\\Lib\\site-packages\\cv2\\data\\haarcascade_frontalface_default.xml") #path for haarcascade.xml in your system
    image_path = sys.argv[1]
    caseNumber = sys.argv[2]
    try:
        image = cv2.imread(image_path)
    except:
        print("File not found at",image_path,file = sys.stderr)
        return
    
    grayImg = cv2.cvtColor(image,cv2.COLOR_BGR2GRAY)
    
    os.mkdir(root+caseNumber)
    
    faces = face_cascade.detectMultiScale(grayImg,1.3,3,minSize=(24,24))
    scale = 440
    
    #print("[INFO] Found {} images".format(len(faces)))  # used for logging can be removed

    
    sampleNumber=0
    for x,y,w,h in faces:
        sampleNumber+=1
        save_img = image[y:y+h,x:x+w]
        dim = (int(save_img.shape[1]*scale/100),int(save_img.shape[0]*scale/100))
        save_img = cv2.resize(save_img,dim,interpolation = cv2.INTER_LANCZOS4)
        #print('[INFO] Saving Image of Suspect{}'.format(sampleNumber)) # used for logging can be removed
        cv2.imwrite(root+caseNumber+'/'+'Suspect-'+str(sampleNumber)+'.jpg',save_img)
        
    for x,y,w,h in faces:
        sampleNumber+=1
        cv2.rectangle(image,(x,y),(x+w,y+h),(0,255,0),2)
            

    cv2.imwrite(root+caseNumber+'/'+'Original Image.jpg',image)
    #print('[INFO] Saved all Images at',root+caseNumber)
    print(root+caseNumber)  #output path of case file
    sys.stdout.flush()

opn()
