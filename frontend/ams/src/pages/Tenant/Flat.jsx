import React, { useState, useEffect, useContext } from 'react';
import api from '../../utils/api'; // Adjust the path as needed
import { DataContext } from '../../context/UserContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

const FlatsManagement = () => {
  const [flats, setFlats] = useState([]);
  const [filteredFlats, setFilteredFlats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newFlat, setNewFlat] = useState({ type: '', floor: '', number: '' });
  const [tenantId, setTenantId] = useState('');
  const [selectedFlat, setSelectedFlat] = useState(null);
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
    } finally {
      setLoading(false);
    }
  };
if(isAdmin){
  const fetchTenants = async () => {
    try {
      const res = await api.get('/tenants');
      const allTenants=res.data.tenants;
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
   // Wait for flats to be fetched
      fetchTenants(); // Now fetch tenants
      fetchData();},[]);
  
}

  useEffect(() => {
    const fetchData = async () => {
        await fetchAllFlats(); // Wait for flats to be fetched
        await fetchTenants(); // Now fetch tenants
      };
      fetchData();},[]);

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
    try {
      await api.post('/flats', newFlat);
      setNewFlat({ type: '', floor: '', number: '' });
      fetchAllFlats();
    } catch (error) {
      console.error('Error creating flat:', error);
      setError('Error creating flat');
    }
  };

  const handleAssignTenant = async (flatId) => {
    try {
      await api.post('/flats/assign', { flatId, tenantId });
      setTenantId('');
      fetchAllFlats();
      setShowTenantSelection(false);
    } catch (error) {
      console.error('Error assigning tenant:', error);
      setError('Error assigning tenant');
    }
  };

  const handleOpenTenantSelection = async (flatId) => {
    setSelectedFlat(flatId);
    await fetchTenants();
    setShowTenantSelection(true);
  };

  const closeTenantSelection = () => {
    setShowTenantSelection(false);
    setTenantId('');
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
      setSelectedFlat(res.data.flat);
    } catch (error) {
      console.error('Error fetching flat details:', error);
      setError('Error fetching flat details');
    }
  };

  const closeModal = () => {
    setSelectedFlat(null);
  };
  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-danger text-center">{error}</div>;

  return (
    <div className="container my-4">
    <div style={{ height: "6rem" }}></div>
      <h1 className="text-center text-primary mb-4">Flats Management</h1>

      {/* Only show the create flat section if the user is an admin */}
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
            <button onClick={handleCreateFlat} className="btn btn-success">Create Flat</button>
          </div>
        </div>
      )}

      <div className="mb-4">
       {isAdmin ?( <h2 className="text-secondary">Flats</h2>):<h2 className="text-secondary">Vacant Flats</h2>}
        <table className="table table-bordered">
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
                {isAdmin && (
                  <td>
                    {flat.status === 'occupied' ? (
                      <button onClick={() => handleViewFlatDetails(flat._id)} className="btn btn-info btn-sm">View Details</button>
                    ) : (
                      <button onClick={() => handleOpenTenantSelection(flat._id)} className="btn btn-warning btn-sm">Assign Tenant</button>
                    )}
                  </td>
                )}

               
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedFlat && (
        <div className="modal" style={{ display: 'block', zIndex: 1050 }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Flat Details</h5>
                <button onClick={closeModal} className="btn-close"></button>
              </div>
              <div className="modal-body">
                <p><strong>Type:</strong> {selectedFlat.type}</p>
                <p><strong>Floor:</strong> {selectedFlat.floor}</p>
                <p><strong>Number:</strong> {selectedFlat.number}</p>
                <p><strong>Status:</strong> {selectedFlat.status}</p>
                <p><strong>Tenant:</strong> {selectedFlat.tenant ? selectedFlat.tenant.name : 'No tenant assigned'}</p>
                {selectedFlat.tenant ? (
    <div>
      <h5 className="mt-3">Tenant Profile</h5>
      <p><strong>Name:</strong> {selectedFlat.tenant.name}</p>
      <p><strong>Email:</strong> {selectedFlat.tenant.email}</p>
      <p><strong>Phone:</strong> {selectedFlat.tenant.phoneNumber || 'No phone number provided'}</p>
      <p><strong>Emergency Contact:</strong> {selectedFlat.tenant.emergencyContact || 'No emergency contact provided'}</p>
      
      <h6 className="mt-3">Family Members</h6>
      
      {selectedFlat.tenant.familyMembers && selectedFlat.tenant.familyMembers.length > 0 ? (
        
        <ul>
          {selectedFlat.tenant.familyMembers.map((member, index) => (
            <li key={index}>{member.name} ({member.relation})</li>
          ))}
        </ul>
      ) : (
        <p>No family members assigned</p>
      )}
      
      <p><strong>Documents:</strong> {selectedFlat.tenant.documents && selectedFlat.tenant.documents.length > 0 ? (
        <ul>
          {selectedFlat.tenant.documents.map((doc, index) => (
            <li key={index}>{doc.toString()}</li> // Assuming documents are stored as ObjectId references, display them as strings or modify as needed
          ))}
        </ul>
      ) : (
        'No documents uploaded'
      )}</p>
    </div>
  ) : (
    <p>No tenant assigned</p>
  )}
              </div>
              <div className="modal-footer">
                <button onClick={closeModal} className="btn btn-secondary">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tenant Selection Modal */}
      {showTenantSelection && (
        <div className="modal" style={{ display: 'block', zIndex: 1050 }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Select Tenant to Assign</h5>
                <button onClick={closeTenantSelection} className="btn-close"></button>
              </div>
              <div className="modal-body">
                <ul className="list-group">
                  {availableTenants.map(tenant => (
                    <li key={tenant._id} className="list-group-item d-flex justify-content-between align-items-center">
                      {tenant.name}
                      <button onClick={() => setTenantId(tenant._id)} className="btn btn-success btn-sm">Select</button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="modal-footer">
                <button onClick={() => handleAssignTenant(selectedFlat)} className="btn btn-primary">Assign Tenant</button>
                <button onClick={closeTenantSelection} className="btn btn-secondary">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      
    </div>
  );
};

export default FlatsManagement;
