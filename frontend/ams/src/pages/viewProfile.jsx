<Dialog open={openProfile} onClose={() => handleDialogClose(setOpenProfile)} maxWidth="md" fullWidth>
        <DialogTitle style={{ backgroundColor: '#343a40', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">View Profile</Typography>
          <IconButton style={{ color: 'white' }} onClick={() => handleDialogClose(setOpenProfile)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers style={{ padding: '20px', backgroundColor: '#f8f9fa' }}>
          {user ? (
            <form style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <TextField label="Name" value={user.name} fullWidth margin="normal" InputProps={{ readOnly: true }} />
              <TextField label="Email" value={user.email} fullWidth margin="normal" InputProps={{ readOnly: true }} />
              <TextField label="Role" value={user.role} fullWidth margin="normal" InputProps={{ readOnly: true }} />
              <TextField label="Flat" value={user.flat ? user.flat.name : 'Not Assigned'} fullWidth margin="normal" InputProps={{ readOnly: true }} />
              <TextField label="Phone Number" value={user.phoneNumber || 'Not Provided'} fullWidth margin="normal" InputProps={{ readOnly: true }} />
              <TextField label="Emergency Contact" value={user.emergencyContact || 'Not Provided'} fullWidth margin="normal" InputProps={{ readOnly: true }} />

              <Typography variant="h6" style={{ marginTop: '20px' }}>Family Members:</Typography>
              {user.familyMembers && user.familyMembers.length > 0 ? (
                <List>
                  {user.familyMembers.map((member, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={`${member.name} (${member.relation})`} />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography>No family members listed.</Typography>
              )}

              <Typography variant="h6" style={{ marginTop: '20px' }}>Documents:</Typography>
              {user.documents && user.documents.length > 0 ? (
                <List>
                  {user.documents.map((doc, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={doc} />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography>No documents uploaded.</Typography>
              )}
            </form>
          ) : (
            <Typography variant="body1">Loading...</Typography>
          )}
        </DialogContent>
      </Dialog>
