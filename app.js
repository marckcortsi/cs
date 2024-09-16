// Función para cargar el archivo CSV y convertirlo en un array de objetos
function cargarCSV(callback) {
    fetch('DB.csv')
        .then(response => response.text())
        .then(data => {
            const lines = data.split('\n');
            const headers = lines[0].split(',').map(header => header.trim()); // Asegurarse de que los encabezados no tengan espacios
            const results = [];

            for (let i = 1; i < lines.length; i++) {
                const row = lines[i].split(',');
                const rowData = {};
                headers.forEach((header, index) => {
                    rowData[header.trim()] = row[index] ? row[index].trim() : ''; // Asegurarse de que los valores no tengan espacios
                });
                results.push(rowData);
            }
            callback(results);
        })
        .catch(error => {
            document.getElementById('statusMessage').innerText = 'Error al cargar el archivo CSV';
            document.getElementById('statusMessage').style.display = 'block';
            console.error('Error al cargar el archivo CSV:', error);
        });
}

// Función para buscar el CP ingresado y mostrar los resultados
function buscar() {
    const searchText = document.getElementById('searchText').value.trim();
    if (searchText === '') {
        alert('Por favor, ingrese un Código Postal.');
        return;
    }

    // Ocultar cualquier mensaje previo de estado
    document.getElementById('statusMessage').style.display = 'none';

    // Mostrar loader mientras se busca
    document.getElementById('loader').style.display = 'block';

    // Cargar los datos del CSV y buscar el CP
    cargarCSV((data) => {
        const resultado = data.find(row => row['CP'].trim() === searchText.trim());

        // Limpiar la tabla de resultados
        const tbody = document.querySelector('#resultTable tbody');
        tbody.innerHTML = '';

        // Ocultar loader después de buscar
        document.getElementById('loader').style.display = 'none';

        if (resultado) {
            const row = `<tr>
                <td>${resultado['CP']}</td>
                <td>${resultado['Plaza']}</td>
                <td>${resultado['Estado']}</td>
                <td>${resultado['Municipio']}</td>
                <td>${resultado['Colonia']}</td>
                <td>${resultado['Zona']}</td>
                <td>${resultado['Caja 1 KG']}</td>
                <td>${resultado['Costo por kilo adicional']}</td>
                <td>${resultado['Palet']}</td>
            </tr>`;
            tbody.innerHTML = row;
        } else {
            alert('No se encontró el Código Postal ingresado.');
        }
    });
}
