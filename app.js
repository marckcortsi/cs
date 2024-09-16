// Función para cargar el archivo CSV y convertirlo en un array de objetos
function cargarCSV(callback) {
    fetch('DB.csv')
        .then(response => response.text())
        .then(data => {
            const lines = data.split('\n');
            const headers = lines[0].split(',').map(header => header.trim()); // Limpiar encabezados
            const results = [];

            for (let i = 1; i < lines.length; i++) {
                const row = lines[i].split(',');
                const rowData = {};
                headers.forEach((header, index) => {
                    rowData[header] = row[index] ? row[index].trim() : ''; // Limpiar valores
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

    // Mostrar loader mientras se busca
    document.getElementById('loader').style.display = 'block';

    // Cargar los datos del CSV y buscar el CP
    cargarCSV((data) => {
        const resultado = data.find(row => row['CP'].trim() === searchText);

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

// Función para calcular el costo logístico
function calcularCosto() {
    const cantidadCajas = parseInt(document.getElementById('cantidadCajas').value);
    const pesoPorCaja = parseFloat(document.getElementById('pesoPorCaja').value);

    // Verificar si los campos están completos y correctos
    if (!cantidadCajas || !pesoPorCaja) {
        alert("Por favor, ingrese la cantidad de cajas y el peso por caja.");
        return;
    }

    // Obtener el valor del campo "Caja 1 KG" y "Costo por kilo adicional" de la tabla
    const caja1KG = document.querySelector('#resultTable tbody tr td:nth-child(7)').innerText;
    const costoPorKiloAdicional = document.querySelector('#resultTable tbody tr td:nth-child(8)').innerText;

    // Verificar que los datos existan
    if (!caja1KG || !costoPorKiloAdicional) {
        alert("Por favor, busca un CP antes de calcular el costo.");
        return;
    }

    // Convertir los valores a números (eliminando el símbolo de dólar)
    const precioCaja1KG = parseFloat(caja1KG.replace('$', ''));
    const precioKiloAdicional = parseFloat(costoPorKiloAdicional.replace('$', ''));

    // Inicializar el costo total
    let costoTotal = 0;

    // Calcular el costo para cada caja
    for (let i = 0; i < cantidadCajas; i++) {
        if (pesoPorCaja > 1) {
            // Si el peso de la caja es mayor a 1kg, sumar el costo adicional por cada kilo extra
            const kilosAdicionales = pesoPorCaja - 1;
            costoTotal += precioCaja1KG + (kilosAdicionales * precioKiloAdicional);
        } else {
            // Si la caja pesa 1kg o menos, solo se suma el costo base
            costoTotal += precioCaja1KG;
        }
    }

    // Mostrar el costo total calculado
    document.getElementById('costoTotal').innerText = `Costo total: $${costoTotal.toFixed(2)}`;
}
