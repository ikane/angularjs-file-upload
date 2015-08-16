package easyupload.repository;

import easyupload.entity.FileUpload;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FileUploadRepository extends JpaRepository<FileUpload, Long> {
    FileUpload findByFilenameContaining(String filename);
}
