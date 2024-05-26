let subjects = [];
let currentEditIndex = -1;

function loadSubjects() {
    const data = localStorage.getItem('subjects');
    if (data) {
        subjects = JSON.parse(data);
    }
    displaySubjects();
}

function saveSubjects() {
    localStorage.setItem('subjects', JSON.stringify(subjects));
}

function addSubject() {
    const subjectName = document.getElementById('subjectName').value;
    if (subjectName) {
        subjects.push({
            name: subjectName,
            present: 0,
            total: 0
        });
        document.getElementById('subjectName').value = '';
        saveSubjects();
        displaySubjects();
    }
}

function markAttendance(index, status) {
    if (status === 'present') {
        subjects[index].present += 1;
    }
    subjects[index].total += 1;
    saveSubjects();
    displaySubjects();
}

function editAttendance(index) {
    currentEditIndex = index;
    const subject = subjects[index];
    document.getElementById('editPresent').value = subject.present;
    document.getElementById('editTotal').value = subject.total;
    document.getElementById('editModal').style.display = 'block';
}

function updateAttendance() {
    const present = parseInt(document.getElementById('editPresent').value);
    const total = parseInt(document.getElementById('editTotal').value);
    if (!isNaN(present) && !isNaN(total) && present <= total) {
        subjects[currentEditIndex].present = present;
        subjects[currentEditIndex].total = total;
        saveSubjects();
        displaySubjects();
        closeModal();
    }
}

function deleteSubject(index) {
    subjects.splice(index, 1);
    saveSubjects();
    displaySubjects();
}

function closeModal() {
    document.getElementById('editModal').style.display = 'none';
}

function displaySubjects() {
    const container = document.getElementById('subjectsContainer');
    container.innerHTML = '';
    subjects.forEach((subject, index) => {
        const attendancePercentage = subject.total > 0 ? (subject.present / subject.total * 100).toFixed(2) : 0;
        const neededClasses = subject.present >= subject.total * 0.75 ? 0 : Math.ceil((0.75 * subject.total - subject.present) / 0.25);
        container.innerHTML += `
            <div class="subject">
                <h3>${subject.name}</h3>
                <div class="attendance">
                    <button class="present" onclick="markAttendance(${index}, 'present')">Mark Present</button>
                    <button class="absent" onclick="markAttendance(${index}, 'absent')">Mark Absent</button>
                </div>
                <div class="stats">
                    <p>Present: ${subject.present}</p>
                    <p>Total: ${subject.total}</p>
                    <p>Attendance: ${attendancePercentage}%</p>
                    <p>Classes Needed for 75%: ${neededClasses}</p>
                </div>
                <div class="edit-buttons">
                    <button onclick="editAttendance(${index})">Edit</button>
                    <button class="delete" onclick="deleteSubject(${index})">Delete</button>
                </div>
            </div>
        `;
    });
}

document.addEventListener('DOMContentLoaded', loadSubjects);
