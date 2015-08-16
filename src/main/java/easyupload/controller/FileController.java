package easyupload.controller;

import easyupload.entity.FileUpload;
import easyupload.service.FileUploadService;
import net.coobird.thumbnailator.Thumbnails;
import net.coobird.thumbnailator.name.Rename;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import java.awt.image.BufferedImage;
import java.io.BufferedOutputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Iterator;

import javax.imageio.ImageIO;

//@CrossOrigin
@RestController
public class FileController {

    @Autowired
    FileUploadService fileUploadService;

    // Download a file
    @RequestMapping(
            value = "/download",
            method = RequestMethod.GET
    )
    public ResponseEntity<?> downloadFile(@RequestParam("filename") String filename) {

        FileUpload fileUpload = fileUploadService.findByFilename(filename);

        // No file found based on the supplied filename
        if (fileUpload == null) {
            return new ResponseEntity<>("{}", HttpStatus.NOT_FOUND);
        }

        // Generate the http headers with the file properties
        HttpHeaders headers = new HttpHeaders();
        headers.add("content-disposition", "attachment; filename=" + fileUpload.getFilename());

        // Split the mimeType into primary and sub types
        String primaryType, subType;
        try {
            primaryType = fileUpload.getMimeType().split("/")[0];
            subType = fileUpload.getMimeType().split("/")[1];
        }
        catch (IndexOutOfBoundsException | NullPointerException ex) {
            return new ResponseEntity<>("{}", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        headers.setContentType( new MediaType(primaryType, subType) );

        return new ResponseEntity<>(fileUpload.getFile(), headers, HttpStatus.OK);
    }
    
    @RequestMapping(value="/image/{imageName}", method=RequestMethod.GET)
    public ResponseEntity<FileUpload> findImage(@PathVariable String imageName) {
    	
    	FileUpload fileUpload = fileUploadService.findByFilename(imageName);
    	
    	return new ResponseEntity<>(fileUpload, HttpStatus.OK);
    }


    @RequestMapping(
            value = "/upload",
            method = RequestMethod.POST
    )
    public ResponseEntity uploadFile(MultipartHttpServletRequest request) {

        try {
            Iterator<String> itr = request.getFileNames();

            while (itr.hasNext()) {
                String uploadedFile = itr.next();
                MultipartFile file = request.getFile(uploadedFile);
                String mimeType = file.getContentType();
                String filename = file.getOriginalFilename();
                byte[] bytes = file.getBytes();

                FileUpload newFile = new FileUpload(filename, bytes, mimeType);

                fileUploadService.uploadFile(newFile);
            }
        }
        catch (Exception e) {
            return new ResponseEntity<>("{}", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>("{}", HttpStatus.OK);
    }
    
    @ResponseStatus(HttpStatus.OK)
    @RequestMapping(value = "/uploadPic")
    public void uploadPic(@RequestParam("picture") MultipartFile file, FileUpload fileUpload ) throws IOException {

        byte[] bytes = null;

        if (!file.isEmpty()) {
        	
        	//Thumbnails.of(file.getInputStream()).size(80, 80).toFiles(Rename.PREFIX_DOT_THUMBNAIL);
        	/*
        	BufferedImage originalImage = ImageIO.read(file.getInputStream());

        	BufferedImage thumbnail = Thumbnails.of(originalImage)
        	        .size(200, 200)
        	        .asBufferedImage();
        	*/
        	
        	        
        	//OutputStream os = new BufferedOutputStream(out)
        	//File thumbFile = new File(file.getOriginalFilename());
        	//Thumbnails.of(file.getInputStream()).size(80, 80).asFiles(thumbFile, Rename.PREFIX_DOT_THUMBNAIL);
        	
        	ByteArrayOutputStream bos = new ByteArrayOutputStream();
        	Thumbnails.of(file.getInputStream()).size(110, 110).toOutputStream(bos);
        	
        	//new BufferedOutputStream(new FileOutputStream(thumbFile)).
        	
        	//new FileInputStream(thumbFile).read(bytes);
        	
             //bytes = file.getBytes();
        	bytes = bos.toByteArray();
             String mimeType = file.getContentType();
             String filename = file.getOriginalFilename();
             
            //store file in storage
             
            FileUpload newFile = new FileUpload(filename, bytes, mimeType);
            newFile.setUsername(fileUpload.getUsername());
            newFile.setEmail(fileUpload.getEmail());
            
            fileUploadService.uploadFile(newFile);
        }

        //System.out.println(String.format("receive %s from %s", file.getOriginalFilename(), username));
    }

}
