// Función para cargar el archivo CSV y convertirlo en un array de objetos
function cargarCSV(callback) {
    fetch('DB.csv')
        .then(response => response.text())
        .then(data => {
            const lines = data.split('\n');
            const headers = lines[0].split(',');
            const results = [];

            for (let i = 1; i < lines.length; i++) {
                const row = lines[i].split(',');
                const rowData = {};
                headers.forEach((header, index) => {
                    rowData[header.trim()] = row[index] ? row[index].trim() : '';
                });
                results.push(rowData);
            }
            callback(results);
        })
        .catch(error => console.error('Error al cargar el archivo CSV:', error));
}

// Función para buscar el CP ingresado y mostrar los resultados
function buscar() {
    const searchText = document.getElementById('searchText').value.trim();
    if (searchText === '') {
        alert('Por favor, ingrese un Código Postal.');
        return;
    }

    // Cargar los datos del CSV y buscar el CP
    cargarCSV((data) => {
        const resultado = data.find(row => row['CP'] === searchText);

        // Limpiar la tabla de resultados
        const tbody = document.querySelector('#resultTable tbody');
        tbody.innerHTML = '';

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
