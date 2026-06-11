const searchDocuments = async (Model, queryParams) => {
    const { name, lastName, email, carnet, local, status } = queryParams;
    let filter = {};

    if (name) filter.name = { $regex: name, $options: "i" };
    if (lastName) filter.lastName = { $regex: lastName, $options: "i" };
    if (email) filter.email = email.toLowerCase().trim();
    if (carnet) filter.carnet = { $regex: carnet, $options: "i" };
    if (local) filter.local = { $regex: local, $options: "i" };
    if (status) filter.status = status;

    return await Model.find(filter).select("-password");
};

const deleteDocumentById = async (Model, id) => {
    return await Model.findByIdAndDelete(id);
};

export default {
    searchDocuments,
    deleteDocumentById,
};