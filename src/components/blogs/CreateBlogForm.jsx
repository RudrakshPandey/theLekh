import { useContext, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import InputComponent from "../ui/InputComponent";
import { validateCreateBlogForm } from "../../validators/blog/createBlogValidator";
import axios from "axios";
import AuthContext from "../../context/AuthContext";
import { Oval } from "react-loader-spinner";
// import { SiGooglegemini } from "react-icons/si";
// import { model } from "../../utils/gemini-ai";
// import { validateGeminiInput } from "../../validators/blog/geminiValidator";

const CreateBlogForm = ({ ...props }) => {
  const fileInputRef = useRef(null);
  const { token } = useContext(AuthContext);
  const react_base_url = import.meta.env.VITE_API_BASE_URL;
  const preset = import.meta.env.VITE_CLOUDINARY_PRESET;
  const c_upload_url = import.meta.env.VITE_CLOUDINARY_UPLOAD_URL;

  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    heroImage: null,
  });
  const [errors, setErrors] = useState({});
  // const [aiLoading, setAiLoading] = useState(false);

  const quillModules = {
    toolbar: [
      ["bold", "italic", "underline"],
      ["blockquote", "code-block"],
      ["link"],
      [{ list: "ordered" }, { list: "bullet" }],
    ],
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const handleImageChange = () => {
    setErrors({});
    if (fileInputRef.current.files[0]) {
      const fileUrl = URL.createObjectURL(fileInputRef.current.files[0]);
      setFormData((prevData) => ({
        ...prevData,
        heroImage: fileUrl,
      }));
      setSelectedImage(fileUrl);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setFormData((prevData) => ({
      ...prevData,
      heroImage: null,
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getInputClass = (fieldName) => (errors[fieldName] ? "input-error" : "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const validationErrors = validateCreateBlogForm(formData);
    if (validationErrors) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    try {
      // Upload image to Cloudinary
      const imageData = new FormData();
      imageData.append("file", fileInputRef.current.files[0]);
      imageData.append("upload_preset", preset);

      const res = await axios.post(c_upload_url, imageData);
      const imageUrl = res.data.secure_url;

      // Submit blog data
      const newBlog = await axios.post(
        `${react_base_url}/blogs/create-blog`,
        {
          title: formData.title,
          content: formData.content,
          excerpt: formData.excerpt,
          category: formData.category,
          heroImage: imageUrl,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      props.handleNewLink(newBlog.data.id);

      setFormData({
        title: "",
        excerpt: "",
        content: "",
        category: "",
        heroImage: null,
      });
      handleRemoveImage();
      props.handleSuccess();
    } catch (error) {
      setErrors({ server: "Something went wrong. Please try again." });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // const handleAIOutput = async () => {
  //   setAiLoading(true);

  //   const validationErrors = validateGeminiInput(formData.title, formData.category);
  //   if (validationErrors) {
  //     setErrors(validationErrors);
  //     setAiLoading(false);
  //     return;
  //   }

  //   try {
  //     const res = await model.generateContent(
  //       `Write a short blog on ${formData.title} and based on category ${formData.category}. Return response in plain text`
  //     );

  //     // Update content with AI generated text
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       content: res.response.text(),
  //     }));
  //     loadUser();
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setAiLoading(false);
  //   }
  // };

  return (
    <form className="create-blog-form-container" onSubmit={handleSubmit}>
      {/* Title */}
      <InputComponent
        label="Title"
        type="text"
        id="title"
        name="title"
        value={formData.title}
        onChange={handleInputChange}
        className={getInputClass("title")}
        error={errors.title}
      />

      {/* Excerpt */}
      <InputComponent
        label={`Excerpt (brief description. max characters 250). (${formData.excerpt.length}/250)`}
        type="textarea"
        id="excerpt"
        name="excerpt"
        value={formData.excerpt}
        onChange={handleInputChange}
        className={`${getInputClass("excerpt")} create-blog-excerpt-f`}
        error={errors.excerpt}
        rows={5}
      />

      {/* Category */}
      <InputComponent
        label="Category"
        type="select"
        id="category"
        name="category"
        value={formData.category}
        onChange={handleInputChange}
        className={`${getInputClass("category")} create-blog-select-category`}
        error={errors.category}
      />

      {/* Content */}
      <div className="form-group">
        <label htmlFor="content">Content</label>
        <ReactQuill
          theme="snow"
          value={formData.content}
          onChange={(value) => setFormData({ ...formData, content: value })}
          modules={quillModules}
          className="create-blog-content-f"
        />
        {errors.content && <p className="error-message">{errors.content}</p>}
      </div>

      {/* AI Generate Content */}
      {/* <label>
        Or generate content with Google&apos;s Gemini{" "}
      </label>
      <button
        type="button"
        onClick={handleAIOutput}
        className={`create-blog-ai-gen-btn-cb-ai-disabled`}
      >
        {aiLoading ? (
          <>
            <Oval
              visible={aiLoading}
              height="20"
              width="20"
              color="#f369f2"
              ariaLabel="oval-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
            <span style={{ marginLeft: "1rem" }}>Generating content . . .</span>
          </>
        ) : (
          <>
            Generate with <SiGooglegemini />
          </>
        )}
      </button> */}

      {/* Add Image */}
      <div className="form-group create-blog-file-container">
        <label htmlFor="heroImage">Image</label>
        <div className="aspect-ratio-msg">
          <span>(aspect ratios: 16:9 suits the best.)</span>
        </div>
        <input
          type="file"
          name="heroImage"
          id="heroImage"
          accept="image/*"
          onChange={handleImageChange}
          ref={fileInputRef}
          className={`${getInputClass("heroImage")} create-blog-fileInput`}
        />
        {errors.heroImage && <p className="error-message">{errors.heroImage}</p>}

        {selectedImage && (
          <div className="create-blog-preview-img">
            <img
              src={selectedImage}
              alt="selected"
              style={{ width: "100%", height: "auto", objectFit: "cover" }}
            />
            <button type="button" onClick={handleRemoveImage}>
              Remove Image
            </button>
          </div>
        )}
      </div>

      {errors.server && <span className="error-message">{errors.server}</span>}

      {/* Submit */}
      <div className="create-blog-form-sub-btn">
        <button className="submit-button" disabled={isLoading}>
          {isLoading ? (
            <>
              <Oval
                visible={isLoading}
                height="20"
                width="20"
                color="#fff"
                ariaLabel="oval-loading"
                wrapperStyle={{}}
                wrapperClass=""
              />
              <span style={{ marginLeft: "1rem" }}>Creating new Blog . . .</span>
            </>
          ) : (
            "Create Blog"
          )}
        </button>
      </div>
    </form>
  );
};

export default CreateBlogForm;