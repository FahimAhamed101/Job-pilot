import { Image, message } from "antd";
import { useState } from "react";
import { imageBaseUrl } from "../../config/imageBaseUrl";
import {
  useApproveProductMutation,
  useGetAllProductRequestQuery,
} from "../../redux/features/product/productApi";

const ProductRequestList = () => {
  const productsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const {
    data: allProduct,
    isLoading,
    isError,
  } = useGetAllProductRequestQuery();
  console.log(allProduct);

  const [approveProduct] = useApproveProductMutation();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching products</div>;

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = allProduct?.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(allProduct?.length / productsPerPage);

  const changePage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Modal handling
  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleApprove = async () => {
    try {
      await approveProduct(selectedProduct._id).unwrap();
      message.success("Product approved successfully");
      closeModal();
    } catch (error) {
      message.error("Error approving product");
      console.error("Error approving product:", error);
    }
  };

  const handleApproveAll = async () => {
    try {
      for (const product of allProduct) {
        await approveProduct(product._id).unwrap();
      }
      message.success("All products approved successfully");
    } catch (error) {
      message.error("Error approving all products");
      console.error("Error approving all products:", error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Product Request List</h2>
        {!isLoading && allProduct?.length > 0 && (
          <button
            className="px-4 py-2 bg-[#CA915A] text-white rounded-lg"
            onClick={handleApproveAll}
          >
            Approve All
          </button>
        )}
      </div>

      <div className="space-y-4">
        {currentProducts?.map((product) => (
          <div
            key={product.id}
            className="flex  items-center p-4 border border-[#CA915A] rounded-lg"
          >
            <div className="flex  items-center space-x-20 w-full">
              <div className="w-full">
                <h4>user name</h4>
                <h1>{product?.author?.name}</h1>
              </div>
              {/* Product Image */}
              <div className="w-full rounded-md">
                <img
                  className="size-32 rounded-md w-32 h-32"
                  src={`${imageBaseUrl}${product?.image}`}
                  alt=""
                />
              </div>

              <div className="w-full">
                <h4>Product Name</h4>
                <p className="text-gray-500"> {product.title}</p>
              </div>
              {/* Product Details */}
              <div className="w-full">
                <h4>Size</h4>
                <p className="text-gray-500"> {product.size}</p>
              </div>
              <div className="w-full">
                <h2>Age</h2>
                <p className="text-gray-500">{product.age}</p>
              </div>

              {/* View Details Button */}
              <div className="w-full">
                <button
                  className=" px-4 py-2 bg-[#CA915A] text-white rounded-lg"
                  onClick={() => openModal(product)}
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {allProduct?.length > 0 && !isLoading && (
        <div className="mt-4 flex justify-center space-x-4">
          <button
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg"
          >
            Prev
          </button>
          {[...Array(totalPages).keys()].map((page) => (
            <button
              key={page + 1}
              onClick={() => changePage(page + 1)}
              className={`px-4 py-2 ${
                currentPage === page + 1
                  ? "bg-[#CA915A] text-white"
                  : "bg-[#CA915A] text-gray-700"
              } rounded-lg`}
            >
              {page + 1}
            </button>
          ))}
          <button
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg"
          >
            Next
          </button>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && selectedProduct && (
        <div className="w-full fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50 bg-[#FAF4EF]">
          <div className=" w-[450px] bg-[#FAF4EF] p-6 rounded-lg w-96">
            <button className="absolute top-2 right-2" onClick={closeModal}>
              <span className="text-2xl">&times;</span>
            </button>

            <h2 className="text-xl font-semibold mb-4">Product Details</h2>

            <div className="mb-4">
              <div className="w-32 h-32 bg-gray-200 mb-4 rounded-md">
                <img
                  className="w-full h-full object-cover rounded-md"
                  src={`${imageBaseUrl}${selectedProduct?.image}`}
                  alt="Product Image"
                />
              </div>
              <div className="flex  mb-5">
                <div className="w-[250px] ">
                  <h4 className="mb-3 font-bold"> Product Name</h4>
                  <p className="">{selectedProduct.title}</p>
                </div>
                <div className="w-[250px] ml-5">
                  <h4 className="mb-3 font-bold">Size</h4>
                  <p> {selectedProduct.size}</p>
                </div>
              </div>

              <div className="flex  mb-5">
                <div className="w-[250px] ">
                  <h4 className="mb-3 font-bold"> Age</h4>
                  <p className="">{selectedProduct.age}</p>
                </div>
                <div className="w-[250px] ml-5">
                  <h4 className="mb-3 font-bold">Color</h4>
                  <p> {selectedProduct.color}</p>
                </div>
              </div>

              <h3 className="font-semibold mt-4">Product Details</h3>
              <p>{selectedProduct.description}</p>

              <div>
                <div>
                  <Image src={selectedProduct.author.image}></Image>
                </div>
                <div>
                  <h4>{selectedProduct.author.name}</h4>
                  <p>{selectedProduct.author.location}</p>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label className="block mb-2">Cancellation Reason:</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Type here the issue..."
              ></textarea>
            </div>

            <div className="mt-4 flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-[#CA915A] text-white rounded-lg"
                onClick={handleApprove}
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductRequestList;
