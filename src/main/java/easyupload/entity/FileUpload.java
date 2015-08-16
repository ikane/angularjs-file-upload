package easyupload.entity;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Lob;

@Entity
public class FileUpload {

    public FileUpload(String filename, byte[] file, String mimeType) {

        this.file = file;
        this.filename = filename;
        this.mimeType = mimeType;
        this.creationDate = new Date();
    }

    public FileUpload() {
        // Default Constructor
    }

    @Id
    private String filename;

    @Lob
    private byte[] file;

    private String mimeType;
    
    private Date creationDate;
    
    private String username;
    
    private String email;


    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public byte[] getFile() {
        return file;
    }

    public void setFile(byte[] file) {
        this.file = file;
    }

    public String getMimeType() {
        return mimeType;
    }

    public void setMimeType(String mimeType) {
        this.mimeType = mimeType;
    }

	public Date getCreationDate() {
		if(creationDate == null) {
			creationDate = new Date();
		}
		return creationDate;
	}

	public void setCreationDate(Date creationDate) {
		this.creationDate = creationDate;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}
	
	
}
