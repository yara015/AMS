import React, { useState, useEffect, useContext } from 'react';
import api from '../../utils/api';
import { DataContext } from '../../context/UserContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import LoadingSpinner from '../Loader';
import { toast } from 'react-toastify';   
import ToastCont from '../toastCont';

const FlatsManagement = () => {
  const [flats, setFlats] = useState([]);
  const [filteredFlats, setFilteredFlats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newFlat, setNewFlat] = useState({ type: '', floor: '', number: '', rent: '' });
  const [tenantId, setTenantId] = useState('');
  const [selectedFlat, setSelectedFlat] = useState(null);
  const [flatDetails, setFlatDetails] = useState(null); // State for flat details
  const [showFlatDetails, setShowFlatDetails] = useState(false); // State to manage flat details modal visibility
  const [statusFilter, setStatusFilter] = useState('all');
  const [filterDropdownVisible, setFilterDropdownVisible] = useState(false);
  const [availableTenants, setAvailableTenants] = useState([]);
  const [showTenantSelection, setShowTenantSelection] = useState(false);
  const { user } = useContext(DataContext);
  const isAdmin = user?.role === 'admin';
  const isTenant = user?.role === 'tenant';

  const fetchAllFlats = async () => {
    try {
      const endpoint = isTenant ? '/flats/vacancies' : '/flats'; 
      const res = await api.get(endpoint);
      setFlats(res.data.flats);
      setFilteredFlats(res.data.flats);
    } catch (error) {
      console.error('Error fetching flats:', error);
      setError('Error fetching flats');
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTenants = async () => {
    try {
      const res = await api.get('/tenants');
      const allTenants = res.data.tenants;
      const assignedTenantIds = flats
        .filter(flat => flat.tenant)
        .map(flat => flat.tenant._id.toString());
      const available = allTenants.filter(
        tenant => !assignedTenantIds.includes(tenant._id.toString())
      );

      setAvailableTenants(available);
    } catch (error) {
      console.error('Error fetching available tenants:', error);
      setError('Error fetching available tenants');
    }
  };

  useEffect(() => {
    fetchAllFlats(); 
  }, []);
{isAdmin && 
  useEffect(() => {
    fetchTenants(); 
  }, [flats]);
}

  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredFlats(flats);
    } else {
      setFilteredFlats(flats.filter(flat => flat.status === statusFilter));
    }
  }, [flats, statusFilter]);

  const handleInputChange = (e) => {
    setNewFlat({ ...newFlat, [e.target.name]: e.target.value });
  };

  const handleCreateFlat = async () => {
    if(!newFlat.type || !newFlat.rent || !newFlat.floor || !newFlat.number){
      return toast.error('all fields required');
    }
    try {
      await api.post('/flats', newFlat);
      setNewFlat({ type: '', floor: '', number: '', rent: '' });
      toast.success('flat created successfully');
    } catch (error) {
      console.log(error);
      // toast.error(`${error.response.data.message}`);
      toast.error('hello');
      setError('Error creating flat');
    }
  };

  const handleAssignTenant = async () => {
    if (!tenantId || !selectedFlat?._id) return;
    try {
      await api.post('/flats/assign', { flatId: selectedFlat._id, tenantId });
      setTenantId('');
      fetchAllFlats();
      closeTenantSelection();
      toast.success('flat assigned successfuly');
    } catch (error) {
      console.error('Error assigning tenant:', error);
      toast.error(`${error.response.data.message}`);
      setError('Error assigning tenant');
    }
  };

  const handleOpenTenantSelection = async (flat) => {
    setSelectedFlat(flat);
    await fetchTenants();
    setShowTenantSelection(true);
  };

  const closeTenantSelection = () => {
    setShowTenantSelection(false);
    setTenantId('');
    setSelectedFlat(null);
  };

  const handleFilterChange = (status) => {
    setStatusFilter(status);
    setFilterDropdownVisible(false);
  };

  const toggleFilterDropdown = () => {
    setFilterDropdownVisible(!filterDropdownVisible);
  };

  const handleViewFlatDetails = async (flatId) => {
    try {
      const res = await api.get(`/flats/${flatId}`);
      setFlatDetails(res.data.flat); // Set the flat details
      setShowFlatDetails(true); // Show the flat details modal
    } catch (error) {
      console.error('Error fetching flat details:', error);
      toast.error(`${error.response.data.message}`);
      setError('Error fetching flat details');
    }
  };

  const closeFlatDetailsModal = () => {
    setShowFlatDetails(false);
    setFlatDetails(null); // Clear flat details when modal closes
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-danger text-center">{error}</div>;

  return (
    <div style={{
      backgroundImage: "url('images/FlatsBg.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
    }}>
      <div style={{ height: "6rem" }}></div>
    <div className="container my-4" >
    <h1 className="text-center text-white mb-4">Flats Management</h1>
      {isAdmin && (
        <div className="mb-4">
          <h2 className="text-secondary">Create New Flat</h2>
          <div className="d-flex mb-2">
            <select
              name="type"
              value={newFlat.type}
              onChange={handleInputChange}
              className="form-control me-2"
            >
              <option value="" disabled>Select Flat Type</option>
              <option value="1BHK">1BHK</option>
              <option value="2BHK">2BHK</option>
              <option value="3BHK">3BHK</option>
              <option value="penthouse">Penthouse</option>
            </select>

            <input
              type="text"
              name="floor"
              placeholder="Floor"
              value={newFlat.floor}
              onChange={handleInputChange}
              className="form-control me-2"
            />
            <input
              type="text"
              name="number"
              placeholder="Flat Number"
              value={newFlat.number}
              onChange={handleInputChange}
              className="form-control me-2"
            />
            <input
              type="text"
              name="rent"
              placeholder="Flat rent"
              value={newFlat.rent}
              onChange={handleInputChange}
              className="form-control me-2"
            />
            <button onClick={handleCreateFlat} className="btn btn-success">Create Flat</button>
          </div>
        </div>
      )}

      <div className="mb-4">
        {isAdmin ? (<h2 className="text-white">Flats</h2>) : (<h2 className="text-white">Vacant Flats</h2>)}
        <table className="table table-bordered" style={{ borderRadius: '10px', overflow: 'hidden' }}>
  <thead className="table-light">
    <tr>
      <th>Flat No.</th>
      {isAdmin && (<th>Tenant Name</th>)}
      <th>Type</th>
      <th>
        Status 
        {isAdmin && (
          <>
            <span onClick={toggleFilterDropdown} style={{ cursor: 'pointer', marginLeft: '5px' }}>
              <FontAwesomeIcon icon={faFilter} />
            </span>
            {filterDropdownVisible && (
              <div className="dropdown-menu show" style={{ position: 'absolute' }}>
                <span className="dropdown-item" onClick={() => handleFilterChange('vacant')}>Vacant</span>
                <span className="dropdown-item" onClick={() => handleFilterChange('occupied')}>Occupied</span>
                <span className="dropdown-item" onClick={() => handleFilterChange('all')}>All</span>
              </div>
            )}
          </>
        )}
      </th>
      <th>Rent</th>
      {isAdmin && (<th>Actions</th>)}
    </tr>
  </thead>
  <tbody>
    {filteredFlats.map(flat => (
      <tr key={flat._id}>
        <td>{flat.number}</td>
        {isAdmin && (<td>{flat.tenant ? flat.tenant.name : 'No tenant assigned'}</td>)}
        <td>{flat.type}</td>
        <td>{flat.status}</td>
        <td>{flat.rent}</td>
        {isAdmin && (
          <td>
            {flat.status === 'occupied' ? (
              <button onClick={() => handleViewFlatDetails(flat._id)} className="btn btn-info">View Details</button>
            ) : (
              <button onClick={() => handleOpenTenantSelection(flat)} className="btn btn-warning">Assign Tenant</button>
            )}
          </td>
        )}
      </tr>
    ))}
  </tbody>
</table>

      </div>

      {/* Flat Details Modal */}
      {showFlatDetails && flatDetails && (
  <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
    <div className="modal-dialog" role="document">
      <div className="modal-content">
      <div className="modal-header d-flex justify-content-between align-items-center">
          <h5 className="modal-title">Flat Details</h5>
          <span
            onClick={closeFlatDetailsModal}
            style={{
              cursor: 'pointer',
              fontSize: '1.5rem',
              color: '#000',
            }}
          >
            &times;
          </span>
        </div>
        <div className="modal-body">
          <p><strong>Type:</strong> {flatDetails.type}</p>
          <p><strong>Floor:</strong> {flatDetails.floor}</p>
          <p><strong>Number:</strong> {flatDetails.number}</p>
          <p><strong>Rent:</strong> {flatDetails.rent}</p>
          <p><strong>Status:</strong> {flatDetails.status}</p>
          {flatDetails.tenant ? (
            <>
              <h6>Assigned Tenant:</h6>
              <p><strong>Name:</strong> {flatDetails.tenant.name}</p>
              <p><strong>Email:</strong> {flatDetails.tenant.email}</p>
              <p><strong>Phone:</strong> {flatDetails.tenant.phone}</p>
              <p><strong>Address:</strong> {flatDetails.tenant.address}</p>
              
              <h6>Family Members:</h6>
              {flatDetails.tenant.familyMembers && flatDetails.tenant.familyMembers.length > 0 ? (
                <ul className="list-unstyled">
                  {flatDetails.tenant.familyMembers.map((member, index) => (
                    <li key={index}>
                      <strong>Name:</strong> {member.name}, <strong>Relation:</strong> {member.relation}, <strong>Age:</strong> {member.age}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No family members listed.</p>
              )}
            </>
          ) : (
            <p>No tenant assigned.</p>
          )}
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={closeFlatDetailsModal}>Close</button>
        </div>
      </div>
    </div>
  </div>
)}


      {/* Tenant Selection Modal */}
      {showTenantSelection && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
            <div className="modal-header d-flex justify-content-between align-items-center">
          <h5 className="modal-title">Flat Details</h5>
          <span
            onClick={closeFlatDetailsModal}
            style={{
              cursor: 'pointer',
              fontSize: '1.5rem',
              color: '#000',
            }}
          >
            &times;
          </span>
        </div>
              <div className="modal-body">
                <select
                  value={tenantId}
                  onChange={(e) => setTenantId(e.target.value)}
                  className="form-control"
                >
                  <option value="" disabled>Select Tenant</option>
                  {availableTenants.map(tenant => (
                    <option key={tenant._id} value={tenant._id}>{tenant.name}</option>
                  ))}
                </select>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeTenantSelection}>Close</button>
                <button type="button" className="btn btn-primary" onClick={handleAssignTenant}>Assign</button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div>
        <ToastCont/>
      </div>
     
    </div>
    </div>
  );
};

export default FlatsManagement;
