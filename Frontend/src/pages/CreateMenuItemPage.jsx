import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import Cropper from "react-easy-crop";

import {
  ChevronLeft,
  ChevronRight,
  ImagePlus,
  RotateCcw,
  RotateCw,
  Trash2,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios.js";
import { toast } from "sonner";

const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 8 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();

    image.addEventListener(
      "load",
      () => resolve(image)
    );

    image.addEventListener(
      "error",
      reject
    );

    image.setAttribute(
      "crossOrigin",
      "anonymous"
    );

    image.src = url;
  });

const getRadianAngle = (
  degreeValue
) => (degreeValue * Math.PI) / 180;

const rotateSize = (
  width,
  height,
  rotation
) => {
  const rotationRadians =
    getRadianAngle(rotation);

  return {
    width:
      Math.abs(
        Math.cos(rotationRadians) *
          width
      ) +
      Math.abs(
        Math.sin(rotationRadians) *
          height
      ),

    height:
      Math.abs(
        Math.sin(rotationRadians) *
          width
      ) +
      Math.abs(
        Math.cos(rotationRadians) *
          height
      ),
  };
};

const getCroppedImage = async (
  imageSrc,
  pixelCrop,
  rotation = 0
) => {
  const image = await createImage(
    imageSrc
  );

  const canvas =
    document.createElement("canvas");

  const context =
    canvas.getContext("2d");

  if (!context) {
    throw new Error(
      "Canvas is not supported in this browser."
    );
  }

  const rotatedSize = rotateSize(
    image.width,
    image.height,
    rotation
  );

  canvas.width = Math.round(
    rotatedSize.width
  );

  canvas.height = Math.round(
    rotatedSize.height
  );

  context.translate(
    canvas.width / 2,
    canvas.height / 2
  );

  context.rotate(
    getRadianAngle(rotation)
  );

  context.translate(
    -image.width / 2,
    -image.height / 2
  );

  context.drawImage(image, 0, 0);

  const croppedCanvas =
    document.createElement("canvas");

  const croppedContext =
    croppedCanvas.getContext("2d");

  if (!croppedContext) {
    throw new Error(
      "Canvas is not supported in this browser."
    );
  }

  croppedCanvas.width = Math.round(
    pixelCrop.width
  );

  croppedCanvas.height = Math.round(
    pixelCrop.height
  );

  croppedContext.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  const blob = await new Promise(
    (resolve, reject) => {
      croppedCanvas.toBlob(
        (result) => {
          if (result) {
            resolve(result);
          } else {
            reject(
              new Error(
                "Unable to create the cropped image."
              )
            );
          }
        },
        "image/jpeg",
        0.9
      );
    }
  );

  return blob;
};

export default function CreateMenuItemPage() {
  const navigate = useNavigate();

  const fileInputRef = useRef(null);
  const imagesRef = useRef([]);
  const pendingImagesRef =
    useRef([]);

  const { user } = useSelector(
    (state) => state.auth
  );

  const [loading, setLoading] =
    useState(false);

  const [menus, setMenus] =
    useState([]);

  const [categories, setCategories] =
    useState([]);

  const [selectedMenu, setSelectedMenu] =
    useState("");

  const [images, setImages] =
    useState([]);

  const [
    cropModalOpen,
    setCropModalOpen,
  ] = useState(false);

  const [
    pendingImages,
    setPendingImages,
  ] = useState([]);

  const [
    pendingIndex,
    setPendingIndex,
  ] = useState(0);

  const [crop, setCrop] = useState({
    x: 0,
    y: 0,
  });

  const [zoom, setZoom] =
    useState(1);

  const [rotation, setRotation] =
    useState(0);

  const [
    croppedAreaPixels,
    setCroppedAreaPixels,
  ] = useState(null);

  const [
    processingImage,
    setProcessingImage,
  ] = useState(false);

  const [formData, setFormData] =
    useState({
      name: "",
      description: "",
      categoryId: "",
      foodType: "Veg",
      isAvailable: true,
    });

  const [variants, setVariants] =
    useState([
      {
        sizeType: "Small",
        price: "",
        discountPrice: "",
      },
    ]);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => {
    pendingImagesRef.current =
      pendingImages;
  }, [pendingImages]);

  useEffect(() => {
    if (user?._id) {
      fetchMenus();
    }
  }, [user?._id]);

  useEffect(() => {
    return () => {
      imagesRef.current.forEach(
        (image) =>
          URL.revokeObjectURL(
            image.preview
          )
      );

      pendingImagesRef.current.forEach(
        (image) =>
          URL.revokeObjectURL(
            image.preview
          )
      );
    };
  }, []);

  const fetchMenus = async () => {
    try {
      const { data } = await api.get(
        `/menu/${user._id}/menu`
      );

      if (data.success) {
        setMenus(data.menus || []);
      }
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data
          ?.message ||
          "Failed to fetch menus"
      );
    }
  };

  const fetchCategories = async (
    menuId
  ) => {
    try {
      const { data } = await api.get(
        `/category/menu/${menuId}`
      );

      if (data.success) {
        setCategories(
          data.categories || []
        );
      }
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data
          ?.message ||
          "Failed to fetch categories"
      );
    }
  };

  const handleMenuChange = async (
    event
  ) => {
    const menuId =
      event.target.value;

    setSelectedMenu(menuId);

    setFormData((previous) => ({
      ...previous,
      categoryId: "",
    }));

    setCategories([]);

    if (menuId) {
      await fetchCategories(menuId);
    }
  };

  const resetCropControls = () => {
    setCrop({
      x: 0,
      y: 0,
    });

    setZoom(1);
    setRotation(0);
    setCroppedAreaPixels(null);
  };

  const closeCropModal = () => {
    pendingImages.forEach((image) =>
      URL.revokeObjectURL(
        image.preview
      )
    );

    setPendingImages([]);
    setPendingIndex(0);
    setCropModalOpen(false);

    resetCropControls();

    if (fileInputRef.current) {
      fileInputRef.current.value =
        "";
    }
  };

  const handleImageChange = (
    event
  ) => {
    const selectedFiles =
      Array.from(
        event.target.files || []
      );

    if (!selectedFiles.length) {
      return;
    }

    const availableSlots =
      MAX_IMAGES - images.length;

    if (availableSlots <= 0) {
      toast.error(
        `You can upload only ${MAX_IMAGES} images.`
      );

      event.target.value = "";

      return;
    }

    const validFiles =
      selectedFiles.filter((file) => {
        if (
          !ALLOWED_TYPES.includes(
            file.type
          )
        ) {
          toast.error(
            `${file.name} is not a supported image type.`
          );

          return false;
        }

        if (
          file.size >
          MAX_FILE_SIZE
        ) {
          toast.error(
            `${file.name} is larger than 8 MB.`
          );

          return false;
        }

        return true;
      });

    const acceptedFiles =
      validFiles.slice(
        0,
        availableSlots
      );

    if (
      validFiles.length >
      availableSlots
    ) {
      toast.info(
        `Only ${availableSlots} more image(s) can be added.`
      );
    }

    if (!acceptedFiles.length) {
      event.target.value = "";

      return;
    }

    const pending =
      acceptedFiles.map((file) => ({
        file,
        preview:
          URL.createObjectURL(file),
      }));

    setPendingImages(pending);
    setPendingIndex(0);
    setCropModalOpen(true);

    resetCropControls();
  };

  const onCropComplete =
    useCallback(
      (
        croppedArea,
        croppedPixels
      ) => {
        setCroppedAreaPixels(
          croppedPixels
        );
      },
      []
    );

  const saveCurrentCrop =
    async () => {
      const current =
        pendingImages[pendingIndex];

      if (
        !current ||
        !croppedAreaPixels
      ) {
        return;
      }

      try {
        setProcessingImage(true);

        const blob =
          await getCroppedImage(
            current.preview,
            croppedAreaPixels,
            rotation
          );

        const baseName =
          current.file.name.replace(
            /\.[^/.]+$/,
            ""
          );

        const croppedFile =
          new File(
            [blob],
            `${baseName}-cropped.jpg`,
            {
              type: "image/jpeg",
              lastModified:
                Date.now(),
            }
          );

        const croppedPreview =
          URL.createObjectURL(
            croppedFile
          );

        setImages((previous) => [
          ...previous,
          {
            id: `${Date.now()}-${Math.random()}`,
            file: croppedFile,
            preview:
              croppedPreview,
            originalName:
              current.file.name,
          },
        ]);

        URL.revokeObjectURL(
          current.preview
        );

        if (
          pendingIndex <
          pendingImages.length - 1
        ) {
          setPendingIndex(
            (previous) =>
              previous + 1
          );

          resetCropControls();
        } else {
          setPendingImages([]);
          setPendingIndex(0);
          setCropModalOpen(false);

          resetCropControls();

          if (
            fileInputRef.current
          ) {
            fileInputRef.current.value =
              "";
          }
        }
      } catch (error) {
        console.error(error);

        toast.error(
          "Failed to crop the image. Please try again."
        );
      } finally {
        setProcessingImage(false);
      }
    };

  const skipCurrentImage = () => {
    const current =
      pendingImages[pendingIndex];

    if (current) {
      URL.revokeObjectURL(
        current.preview
      );
    }

    if (
      pendingIndex <
      pendingImages.length - 1
    ) {
      setPendingIndex(
        (previous) =>
          previous + 1
      );

      resetCropControls();
    } else {
      setPendingImages([]);
      setPendingIndex(0);
      setCropModalOpen(false);

      resetCropControls();

      if (fileInputRef.current) {
        fileInputRef.current.value =
          "";
      }
    }
  };

  const removeImage = (index) => {
    setImages((previous) => {
      const target =
        previous[index];

      if (target) {
        URL.revokeObjectURL(
          target.preview
        );
      }

      return previous.filter(
        (_, imageIndex) =>
          imageIndex !== index
      );
    });
  };

  const moveImage = (
    index,
    direction
  ) => {
    setImages((previous) => {
      const nextIndex =
        index + direction;

      if (
        nextIndex < 0 ||
        nextIndex >= previous.length
      ) {
        return previous;
      }

      const reordered = [
        ...previous,
      ];

      [
        reordered[index],
        reordered[nextIndex],
      ] = [
        reordered[nextIndex],
        reordered[index],
      ];

      return reordered;
    });
  };

  const addVariant = () => {
    setVariants((previous) => [
      ...previous,
      {
        sizeType: "Medium",
        price: "",
        discountPrice: "",
      },
    ]);
  };

  const removeVariant = (
    index
  ) => {
    if (variants.length === 1) {
      return;
    }

    setVariants((previous) =>
      previous.filter(
        (_, variantIndex) =>
          variantIndex !== index
      )
    );
  };

  const updateVariant = (
    index,
    field,
    value
  ) => {
    setVariants((previous) =>
      previous.map(
        (
          variant,
          variantIndex
        ) =>
          variantIndex === index
            ? {
                ...variant,
                [field]: value,
              }
            : variant
      )
    );
  };

  const submitHandler = async (
    event
  ) => {
    event.preventDefault();

    if (!selectedMenu) {
      return toast.error(
        "Please select a menu"
      );
    }

    if (!formData.categoryId) {
      return toast.error(
        "Please select a category"
      );
    }

    if (!formData.name.trim()) {
      return toast.error(
        "Item name is required"
      );
    }

    if (
      !formData.description.trim()
    ) {
      return toast.error(
        "Description is required"
      );
    }

    if (images.length === 0) {
      return toast.error(
        "Please upload at least one image"
      );
    }

    const hasInvalidVariant =
      variants.some(
        (variant) =>
          !variant.price ||
          Number(variant.price) <= 0
      );

    if (hasInvalidVariant) {
      return toast.error(
        "Every variant must have a valid price"
      );
    }

    try {
      setLoading(true);

      const data =
        new FormData();

      data.append(
        "name",
        formData.name.trim()
      );

      data.append(
        "description",
        formData.description.trim()
      );

      data.append(
        "restaurantId",
        user?._id
      );

      data.append(
        "categoryId",
        formData.categoryId
      );

      data.append(
        "foodType",
        formData.foodType
      );

      data.append(
        "isAvailable",
        String(
          formData.isAvailable
        )
      );

      data.append(
        "variants",
        JSON.stringify(variants)
      );

      images.forEach((image) => {
        data.append(
          "image",
          image.file
        );
      });

      const response =
        await api.post(
          "/menu-item/create",
          data
        );

      if (
        response?.data?.success
      ) {
        toast.success(
          "Menu Item Created Successfully"
        );

        navigate(
          "/restaurant/menu"
        );
      }
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data
          ?.message ||
          "Failed to create menu item"
      );
    } finally {
      setLoading(false);
    }
  };

  const activePendingImage =
    pendingImages[pendingIndex];

  return (
    <div className="min-h-screen bg-[#111827] p-4 sm:p-6">
      <div className="mx-auto max-w-7xl rounded-2xl bg-[#1F2937] p-4 sm:p-6">
        <h1 className="mb-8 text-3xl font-bold text-white">
          Add Menu Item
        </h1>

        <form
          onSubmit={submitHandler}
          className="space-y-6"
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-5">
              <div>
                <label className="mb-2 block font-medium text-white">
                  Item Name
                </label>

                <input
                  type="text"
                  placeholder="Enter item name"
                  value={formData.name}
                  onChange={(event) =>
                    setFormData(
                      (previous) => ({
                        ...previous,
                        name: event
                          .target.value,
                      })
                    )
                  }
                  className="w-full rounded-xl border border-gray-700 bg-[#111827] p-3 text-white outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium text-white">
                  Description
                </label>

                <textarea
                  rows={4}
                  placeholder="Enter description"
                  value={
                    formData.description
                  }
                  onChange={(event) =>
                    setFormData(
                      (previous) => ({
                        ...previous,
                        description:
                          event.target
                            .value,
                      })
                    )
                  }
                  className="w-full rounded-xl border border-gray-700 bg-[#111827] p-3 text-white outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium text-white">
                  Menu
                </label>

                <select
                  value={
                    selectedMenu
                  }
                  onChange={
                    handleMenuChange
                  }
                  className="w-full rounded-xl border border-gray-700 bg-[#111827] p-3 text-white outline-none focus:border-orange-500"
                >
                  <option value="">
                    Select Menu
                  </option>

                  {menus.map(
                    (menu) => (
                      <option
                        key={menu._id}
                        value={menu._id}
                      >
                        {menu.name}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label className="mb-2 block font-medium text-white">
                  Category
                </label>

                <select
                  value={
                    formData.categoryId
                  }
                  onChange={(event) =>
                    setFormData(
                      (previous) => ({
                        ...previous,
                        categoryId:
                          event.target
                            .value,
                      })
                    )
                  }
                  disabled={
                    !selectedMenu
                  }
                  className="w-full rounded-xl border border-gray-700 bg-[#111827] p-3 text-white outline-none focus:border-orange-500 disabled:opacity-50"
                >
                  <option value="">
                    Select Category
                  </option>

                  {categories.map(
                    (category) => (
                      <option
                        key={
                          category._id
                        }
                        value={
                          category._id
                        }
                      >
                        {category.name}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label className="mb-2 block font-medium text-white">
                  Food Type
                </label>

                <select
                  value={
                    formData.foodType
                  }
                  onChange={(event) =>
                    setFormData(
                      (previous) => ({
                        ...previous,
                        foodType:
                          event.target
                            .value,
                      })
                    )
                  }
                  className="w-full rounded-xl border border-gray-700 bg-[#111827] p-3 text-white outline-none focus:border-orange-500"
                >
                  <option value="Veg">
                    Veg
                  </option>

                  <option value="Non-Veg">
                    Non-Veg
                  </option>

                  <option value="Egg-Only">
                    Egg-Only
                  </option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block font-medium text-white">
                Upload Images
              </label>

              <button
                type="button"
                onClick={() =>
                  fileInputRef.current?.click()
                }
                disabled={
                  images.length >=
                  MAX_IMAGES
                }
                className="flex min-h-44 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-600 p-6 text-center transition hover:border-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ImagePlus className="mb-3 h-10 w-10 text-orange-500" />

                <span className="font-semibold text-white">
                  Select images to crop
                </span>

                <span className="mt-1 text-sm text-gray-400">
                  JPG, PNG or WebP ·
                  Maximum 8 MB each
                </span>

                <span className="mt-1 text-sm text-gray-400">
                  {images.length}/
                  {MAX_IMAGES} images
                  selected
                </span>
              </button>

              <input
                ref={fileInputRef}
                multiple
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={
                  handleImageChange
                }
                className="hidden"
              />

              {images.length > 0 && (
                <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
                  {images.map(
                    (
                      image,
                      index
                    ) => (
                      <div
                        key={image.id}
                        className="group relative overflow-hidden rounded-xl border border-gray-700 bg-[#111827]"
                      >
                        <img
                          src={
                            image.preview
                          }
                          alt={`Menu item preview ${
                            index + 1
                          }`}
                          className="h-36 w-full object-cover"
                        />

                        {index === 0 && (
                          <span className="absolute left-2 top-2 rounded-full bg-orange-500 px-2 py-1 text-xs font-semibold text-white">
                            Cover
                          </span>
                        )}

                        <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-black/60 p-2 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
                          <button
                            type="button"
                            onClick={() =>
                              moveImage(
                                index,
                                -1
                              )
                            }
                            disabled={
                              index === 0
                            }
                            className="rounded-full bg-white/15 p-2 text-white hover:bg-white/25 disabled:opacity-30"
                            aria-label="Move image left"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              removeImage(
                                index
                              )
                            }
                            className="rounded-full bg-red-500 p-2 text-white hover:bg-red-600"
                            aria-label="Remove image"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              moveImage(
                                index,
                                1
                              )
                            }
                            disabled={
                              index ===
                              images.length -
                                1
                            }
                            className="rounded-full bg-white/15 p-2 text-white hover:bg-white/25 disabled:opacity-30"
                            aria-label="Move image right"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl bg-[#111827] p-5">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold text-white">
                Variants
              </h2>

              <button
                type="button"
                onClick={addVariant}
                className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                Add Variant
              </button>
            </div>

            <div className="space-y-4">
              {variants.map(
                (
                  variant,
                  index
                ) => (
                  <div
                    key={index}
                    className="grid items-center gap-3 lg:grid-cols-4"
                  >
                    <select
                      value={
                        variant.sizeType
                      }
                      onChange={(
                        event
                      ) =>
                        updateVariant(
                          index,
                          "sizeType",
                          event.target
                            .value
                        )
                      }
                      className="rounded-xl border border-gray-700 bg-[#1F2937] p-3 text-white"
                    >
                      <option>
                        Quarter
                      </option>

                      <option>
                        Half
                      </option>

                      <option>
                        Full
                      </option>

                      <option>
                        Small
                      </option>

                      <option>
                        Medium
                      </option>

                      <option>
                        Large
                      </option>

                      <option>
                        ExL
                      </option>
                    </select>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Price"
                      value={
                        variant.price
                      }
                      onChange={(
                        event
                      ) =>
                        updateVariant(
                          index,
                          "price",
                          event.target
                            .value
                        )
                      }
                      className="rounded-xl border border-gray-700 bg-[#1F2937] p-3 text-white"
                    />

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Discount Price"
                      value={
                        variant.discountPrice
                      }
                      onChange={(
                        event
                      ) =>
                        updateVariant(
                          index,
                          "discountPrice",
                          event.target
                            .value
                        )
                      }
                      className="rounded-xl border border-gray-700 bg-[#1F2937] p-3 text-white"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeVariant(
                          index
                        )
                      }
                      disabled={
                        variants.length ===
                        1
                      }
                      className="rounded-xl bg-red-500 py-3 text-white hover:bg-red-600 disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="flex flex-col-reverse justify-end gap-4 pt-4 sm:flex-row">
            <button
              type="button"
              onClick={() =>
                navigate(
                  "/restaurant/menu"
                )
              }
              className="rounded-xl bg-gray-700 px-6 py-3 text-white hover:bg-gray-600"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                loading ||
                processingImage
              }
              className="rounded-xl bg-orange-500 px-8 py-3 font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
            >
              {loading
                ? "Creating..."
                : "Create Menu Item"}
            </button>
          </div>
        </form>
      </div>

      {cropModalOpen &&
        activePendingImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-6">
            <div className="flex max-h-[95vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-[#1F2937] shadow-2xl">
              <div className="flex items-center justify-between border-b border-gray-700 px-4 py-3 sm:px-6">
                <div>
                  <h2 className="font-semibold text-white">
                    Crop image
                  </h2>

                  <p className="text-sm text-gray-400">
                    Image{" "}
                    {pendingIndex +
                      1}{" "}
                    of{" "}
                    {
                      pendingImages.length
                    }
                  </p>
                </div>

                <button
                  type="button"
                  onClick={
                    closeCropModal
                  }
                  disabled={
                    processingImage
                  }
                  className="rounded-full p-2 text-gray-300 hover:bg-white/10 hover:text-white"
                  aria-label="Close crop editor"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="relative h-[50vh] min-h-80 bg-black">
                <Cropper
                  image={
                    activePendingImage.preview
                  }
                  crop={crop}
                  zoom={zoom}
                  rotation={
                    rotation
                  }
                  aspect={1}
                  cropShape="rect"
                  showGrid
                  objectFit="contain"
                  onCropChange={
                    setCrop
                  }
                  onZoomChange={
                    setZoom
                  }
                  onRotationChange={
                    setRotation
                  }
                  onCropComplete={
                    onCropComplete
                  }
                  minZoom={1}
                  maxZoom={4}
                  zoomSpeed={0.15}
                />
              </div>

              <div className="space-y-4 border-t border-gray-700 p-4 sm:p-6">
                <div className="flex items-center gap-3">
                  <ZoomOut className="h-5 w-5 text-gray-300" />

                  <input
                    type="range"
                    min="1"
                    max="4"
                    step="0.01"
                    value={zoom}
                    onChange={(
                      event
                    ) =>
                      setZoom(
                        Number(
                          event.target
                            .value
                        )
                      )
                    }
                    className="w-full accent-orange-500"
                    aria-label="Zoom image"
                  />

                  <ZoomIn className="h-5 w-5 text-gray-300" />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setRotation(
                          (value) =>
                            value - 90
                        )
                      }
                      className="flex items-center gap-2 rounded-lg bg-[#111827] px-3 py-2 text-white hover:bg-gray-700"
                    >
                      <RotateCcw className="h-4 w-4" />

                      Left
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setRotation(
                          (value) =>
                            value + 90
                        )
                      }
                      className="flex items-center gap-2 rounded-lg bg-[#111827] px-3 py-2 text-white hover:bg-gray-700"
                    >
                      <RotateCw className="h-4 w-4" />

                      Right
                    </button>

                    <button
                      type="button"
                      onClick={
                        resetCropControls
                      }
                      className="rounded-lg bg-[#111827] px-3 py-2 text-white hover:bg-gray-700"
                    >
                      Reset
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={
                        skipCurrentImage
                      }
                      disabled={
                        processingImage
                      }
                      className="rounded-lg bg-gray-700 px-4 py-2 text-white hover:bg-gray-600 disabled:opacity-50"
                    >
                      Skip
                    </button>

                    <button
                      type="button"
                      onClick={
                        saveCurrentCrop
                      }
                      disabled={
                        processingImage ||
                        !croppedAreaPixels
                      }
                      className="rounded-lg bg-orange-500 px-5 py-2 font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
                    >
                      {processingImage
                        ? "Processing..."
                        : "Crop & add"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}