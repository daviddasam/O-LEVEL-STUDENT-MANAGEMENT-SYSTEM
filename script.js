
let students = [];


function loadStudents() {
    const saved = localStorage.getItem('olevel_students');
    if (saved) {
        try {
            students = JSON.parse(saved);
        } catch (e) {
            students = [];
        }
    } else {
        students = []; 
    }
}

function saveStudents() {
    localStorage.setItem('olevel_students', JSON.stringify(students));
}


function isIdUnique(id) {
    return !students.some(s => s.id.toLowerCase() === id.trim().toLowerCase());
}

function calculateAverage(performanceArray) {
    if (!performanceArray || performanceArray.length === 0) return '—';
    
    
    const latest = performanceArray[performanceArray.length - 1];
    const subjects = latest.subjects;
    
    
    const scores = [
        subjects.physics, subjects.chemistry, subjects.biology,
        subjects.english, subjects.mathematics, subjects.civics,
        subjects.kiswahili, subjects.history, subjects.geography
    ].filter(score => score !== undefined && !isNaN(score));
    
    if (scores.length === 0) return '—';
    
    const sum = scores.reduce((a, b) => a + b, 0);
    return Math.round(sum / scores.length) + '%';
}


function renderStudentTable() {
    const tbody = document.getElementById('studentTableBody');
    const emptyMsg = document.getElementById('emptyStudentMessage');
    
    if (!tbody) return;  
    
    if (students.length === 0) {
        tbody.innerHTML = '';
        if (emptyMsg) emptyMsg.style.display = 'block';
        return;
    }
    
    if (emptyMsg) emptyMsg.style.display = 'none';
    
    let html = '';
    
    students.forEach((student, index) => {
        const avgScore = calculateAverage(student.performance);
        
        // Promote button (disabled if form 4)
        const promoteBtn = student.form < 4 
            ? `<button class="btn btn-sm btn-outline promote-btn" data-index="${index}"> FORM ${student.form} → ${student.form+1}</button>`
            : `<button class="btn btn-sm" disabled> COMPLETED FORM 4</button>`;
        
        html += `
            <tr>
                <td><code><strong>${student.id}</strong></code></td>
                <td><strong>${student.name}</strong></td>
                <td>${student.age}</td>
                <td>${student.gender}</td>
                <td><span class="badge-form">FORM ${student.form}</span></td>
                <td><span class="score-badge">${avgScore}</span></td>
                <td class="student-actions">
                    <button class="btn btn-sm btn-outline view-details" data-index="${index}"> VIEW</button>
                    <button class="btn btn-sm btn-outline add-score" data-index="${index}">SCORES</button>
                    ${promoteBtn}
                    <button class="btn btn-sm delete-btn" data-index="${index}"> DELETE</button>
                </td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
}


const registerBtn = document.getElementById('registerBtn');
if (registerBtn) {
    registerBtn.addEventListener('click', function() {
        const nameInput = document.getElementById('studentName');
        const idInput = document.getElementById('studentId');
        const ageInput = document.getElementById('studentAge');
        const genderSelect = document.getElementById('studentGender');
        const formSelect = document.getElementById('studentForm');
        const feedback = document.getElementById('registerFeedback');
        
        const name = nameInput.value.trim();
        const id = idInput.value.trim();
        const age = parseInt(ageInput.value, 10);
        const gender = genderSelect.value;
        const form = parseInt(formSelect.value, 10);
        
        // VALIDATION
        if (!name || !id) {
            feedback.innerText = ' ERROR: Full name and Student ID are required!';
            feedback.className = 'feedback error';
            return;
        }
        
        if (isNaN(age) || age < 10 || age > 30) {
            feedback.innerText = ' ERROR: Age must be between 10 and 30.';
            feedback.className = 'feedback error';
            return;
        }
        
        if (!isIdUnique(id)) {
            feedback.innerText = ` ERROR: ID "${id}" already exists! Please use a unique ID.`;
            feedback.className = 'feedback error';
            return;
        }
        
       
        const newStudent = {
            id: id,
            name: name,
            age: age,
            gender: gender,
            form: form,
            performance: [] 
        };
        
        students.push(newStudent);
        saveStudents(); 
        
        feedback.innerText = ' SUCCESS! Student registered. Redirecting to student list...';
        feedback.className = 'feedback success';
        
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    });
}


const modal = document.getElementById('performanceModal');
if (modal) {
    const modalStudentName = document.getElementById('modalStudentName');
    const modalStudentIdForm = document.getElementById('modalStudentIdForm');
    
    
    const scorePhysics = document.getElementById('scorePhysics');
    const scoreChemistry = document.getElementById('scoreChemistry');
    const scoreBiology = document.getElementById('scoreBiology');
    const scoreEnglish = document.getElementById('scoreEnglish');
    const scoreMathematics = document.getElementById('scoreMathematics');
    const scoreCivics = document.getElementById('scoreCivics');
    const scoreKiswahili = document.getElementById('scoreKiswahili');
    const scoreHistory = document.getElementById('scoreHistory');
    const scoreGeography = document.getElementById('scoreGeography');
    
    let currentStudentIndex = null;
    
   
    window.openScoreModal = function(index) {
        const student = students[index];
        if (!student) return;
        
        currentStudentIndex = index;
        modalStudentName.innerText = student.name;
        modalStudentIdForm.innerText = `${student.id} · CURRENT FORM: ${student.form}`;
        
        
        if (student.performance && student.performance.length > 0) {
            const latest = student.performance[student.performance.length - 1].subjects;
            scorePhysics.value = latest.physics || 50;
            scoreChemistry.value = latest.chemistry || 50;
            scoreBiology.value = latest.biology || 50;
            scoreEnglish.value = latest.english || 50;
            scoreMathematics.value = latest.mathematics || 50;
            scoreCivics.value = latest.civics || 50;
            scoreKiswahili.value = latest.kiswahili || 50;
            scoreHistory.value = latest.history || 50;
            scoreGeography.value = latest.geography || 50;
        } else {
           
            scorePhysics.value = 50;
            scoreChemistry.value = 50;
            scoreBiology.value = 50;
            scoreEnglish.value = 50;
            scoreMathematics.value = 50;
            scoreCivics.value = 50;
            scoreKiswahili.value = 50;
            scoreHistory.value = 50;
            scoreGeography.value = 50;
        }
        
        modal.style.display = 'flex';
    };
    
    
    document.getElementById('cancelModalBtn').addEventListener('click', function() {
        modal.style.display = 'none';
        currentStudentIndex = null;
    });
    
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            currentStudentIndex = null;
        }
    });
    
    
    document.getElementById('savePerformanceBtn').addEventListener('click', function() {
        if (currentStudentIndex === null) {
            alert('No student selected.');
            return;
        }
        
        const student = students[currentStudentIndex];
        if (!student) return;
        
       
        const physics = parseInt(scorePhysics.value, 10);
        const chemistry = parseInt(scoreChemistry.value, 10);
        const biology = parseInt(scoreBiology.value, 10);
        const english = parseInt(scoreEnglish.value, 10);
        const mathematics = parseInt(scoreMathematics.value, 10);
        const civics = parseInt(scoreCivics.value, 10);
        const kiswahili = parseInt(scoreKiswahili.value, 10);
        const history = parseInt(scoreHistory.value, 10);
        const geography = parseInt(scoreGeography.value, 10);
        
        const allScores = [physics, chemistry, biology, english, mathematics, civics, kiswahili, history, geography];
        
        
        if (allScores.some(score => isNaN(score) || score < 0 || score > 100)) {
            alert('All scores must be numbers between 0 and 100.');
            return;
        }
        
        
        const performanceRecord = {
            form: student.form,
            date: new Date().toLocaleDateString(),
            subjects: {
                physics: physics,
                chemistry: chemistry,
                biology: biology,
                english: english,
                mathematics: mathematics,
                civics: civics,
                kiswahili: kiswahili,
                history: history,
                geography: geography
            }
        };
        
        student.performance.push(performanceRecord);
        saveStudents();
        
        modal.style.display = 'none';
        renderStudentTable();
        
        alert(` Scores saved for ${student.name} (Form ${student.form})`);
        currentStudentIndex = null;
    });
}


const tableBody = document.getElementById('studentTableBody');
if (tableBody) {
    tableBody.addEventListener('click', function(e) {
        const button = e.target.closest('button');
        if (!button) return;
        
        const index = button.getAttribute('data-index');
        if (index === null) return;
        
        const studentIndex = parseInt(index, 10);
        
       
        if (button.classList.contains('delete-btn')) {
            if (confirm(` Delete ${students[studentIndex].name}? This cannot be undone.`)) {
                const deleted = students.splice(studentIndex, 1)[0];
                saveStudents();
                alert(` Student "${deleted.name}" deleted.`);
                renderStudentTable();
            }
        }
        
        
        else if (button.classList.contains('view-details')) {
            const student = students[studentIndex];
            if (!student) return;
            
            let message = ` STUDENT DETAILS\n`;
            message += `========================\n`;
            message += `Name: ${student.name}\n`;
            message += `ID: ${student.id}\n`;
            message += `Age: ${student.age}\n`;
            message += `Gender: ${student.gender}\n`;
            message += `Current Form: ${student.form}\n\n`;
            message += `ACADEMIC RECORDS:\n`;
            
            if (student.performance.length === 0) {
                message += 'No scores recorded yet.';
            } else {
                student.performance.forEach((record, idx) => {
                    message += `\n--- Form ${record.form} (${record.date || 'N/A'}) ---\n`;
                    message += `Physics: ${record.subjects.physics}, Chemistry: ${record.subjects.chemistry}\n`;
                    message += `Biology: ${record.subjects.biology}, English: ${record.subjects.english}\n`;
                    message += `Mathematics: ${record.subjects.mathematics}, Civics: ${record.subjects.civics}\n`;
                    message += `Kiswahili: ${record.subjects.kiswahili}, History: ${record.subjects.history}\n`;
                    message += `Geography: ${record.subjects.geography}\n`;
                });
            }
            
            alert(message);
        }
        
        
        else if (button.classList.contains('add-score')) {
            openScoreModal(studentIndex);
        }
        
        
        else if (button.classList.contains('promote-btn')) {
            const student = students[studentIndex];
            if (student && student.form < 4) {
                const newForm = student.form + 1;
                if (confirm(`⬆ Promote ${student.name} from Form ${student.form} to Form ${newForm}?`)) {
                    student.form = newForm;
                    saveStudents();
                    renderStudentTable();
                    alert(` ${student.name} is now in Form ${student.form}`);
                }
            }
        }
    });
}


loadStudents();


if (document.getElementById('studentTableBody')) {
    renderStudentTable();
}


window.clearAllData = function() {
    if (confirm(' DELETE ALL STUDENTS? This action cannot be undone!')) {
        students = [];
        saveStudents();
        renderStudentTable();
        alert('All student data has been cleared.');
    }
};