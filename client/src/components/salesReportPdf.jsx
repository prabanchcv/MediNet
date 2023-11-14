import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import PropTypes from 'prop-types'
const styles = StyleSheet.create({
  page: {
    backgroundColor: 'white',
    padding: 20,
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
  },
  column: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    marginBottom: 5,
  },
  prescription: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: "20px"
  }
});

MyPDF.propTypes = {
  data: PropTypes.string,
  user: PropTypes.string
}

function MyPDF({ patients,income }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
      
         
        <View style={styles.container}>
        <View style={styles.column}>
          <Text >MediNet</Text>
       
          </View>
          <View style={styles.column}>
            
          </View>
       
          <View style={styles.column}>
            <Text style={styles.label}>Name : </Text>
            <Text style={styles.label}>Age :</Text>
            <Text style={styles.label}>Gender : </Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Doctor : </Text>
            <Text style={styles.label}>Date : </Text>
            <Text style={styles.label}>Time :</Text>
          </View>
        </View>

        <View>
          <hr />
          <Text style={styles.prescription}>Total Income {income}</Text>
          <Text style={styles.prescription}> {income}</Text>
          <Text style={styles.prescription}>Total Patients</Text>
          <Text style={styles.prescription}> {patients}</Text>
        </View>
      </Page>
    </Document>
  );    

}

export default MyPDF;
