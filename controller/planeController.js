import {PackageRequest} from '../model/planeRequest.js'
import {User} from "../model/User.js"
// Endpoint to handle user package requests app.post("/package-request"



export const RequestPackage = async (req, res) => {
  try {
    const { userId, packageType } = req.body;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Check if the user has already requested a package
    const existingRequest = await PackageRequest.findOne({ user: userId, approved: false });
    if (existingRequest) {
      return res.status(400).json({ success: false, error: "There is already a pending request for package update. Please wait for approval." });
    }

    // Check if the requested package type is valid ('gold' or 'platinum')
    const validPackageTypes = ["gold", "platinum"];
    if (!validPackageTypes.includes(packageType)) {
      return res.status(400).json({ success: false, error: "Invalid package type. Please select either 'gold' or 'platinum'." });
    }

    // Create a new package request
    const packageRequest = new PackageRequest({
      user: userId,
      packageType,
    });
    await packageRequest.save();

    res.status(201).json({ success: true, message: `Package update request for ${packageType} submitted successfully. Please wait for approval.` });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
  // Endpoint to get all package requests app.get("/admin/package-requests", 
  export const getAllPackageRequests = async (req, res) => {
    try {
      // Retrieve all package requests
      const packageRequests = await PackageRequest.find().populate('user', 'username email phone');
  
      // If there are no package requests, return an empty array
      if (!packageRequests || packageRequests.length === 0) {
        return res.status(200).json({ success: true, data: [] });
      }
  
      // Return the package requests with user information
      res.status(200).json({ success: true, data: packageRequests });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  };
// getPackageReqById Endpoint to get package requests by type app.get("/admin/package-requests/:type
export const getPackageReqById = async (req, res) => {
  const { id } = req.params;
  try {
    // Retrieve the package request by its ID
    const packageRequest = await PackageRequest.findById(id).populate('user', 'username email phone');
    console.log("packageRequest:",packageRequest)
    // If the package request does not exist, return a 404 error
    if (!packageRequest) {
      return res.status(404).json({ success: false, error: "Package request not found" });
    }

    // Return the package request with user information
    res.status(200).json({ success: true, data: packageRequest });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
//updae package request approval
export const updatePackageRequest = async (req, res) => {
  const { id } = req.params;
  const { packageType, approved } = req.body;
  console.log(req.body)
  try {
    // Find the package request by its ID
    const packageRequest = await PackageRequest.findById(id);
    console.log(packageRequest)
    // If the package request does not exist, return a 404 error
    if (!packageRequest) {
      return res.status(404).json({ success: false, error: "Package request not found" });
    }

    // Update the packageType and approved fields
    if (packageType) {
      packageRequest.packageType = packageType;
    }
    if (approved !== undefined) {
      packageRequest.approved = approved;
    }

    // Save the updated package request
    await packageRequest.save();

    // Return the updated package request
    res.status(200).json({ success: true, data: packageRequest });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

