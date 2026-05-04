using CloudinaryDotNet;
using CloudinaryDotNet.Actions;

public class PhotoService : IPhotoService
{

     private readonly Cloudinary _cloudinary;

    public PhotoService(Cloudinary cloudinary)
    {
        _cloudinary = cloudinary;
    }
    public async Task<ImageUploadResult> UploadPhotoAsync(IFormFile file)
    {


        var result = new ImageUploadResult();

         if (file.Length == 0)
            return null;

        await using var stream = file.OpenReadStream();

        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(file.FileName, stream),
            Transformation = new Transformation().Height(500).Width(500).Crop("fill").Gravity("face"),
            Folder = "Linky"
        };

         result = await _cloudinary.UploadAsync(uploadParams);

        return result ; 
    }
    

    public async Task<DeletionResult> DeletePhotoAsync(string publicId)
    {
        var deleteParams = new DeletionParams(publicId);

        return await _cloudinary.DestroyAsync(deleteParams);
    }

}