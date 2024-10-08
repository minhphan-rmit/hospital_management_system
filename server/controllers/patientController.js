const database = require("../models/database");

// Get all patients
const getAllPatients = async (req, res) => {
	try {
		const [rows] = await database.poolAdmin.query("CALL getAllPatients()");
		res.json(rows[0]);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};

// Get patient by id
const getPatientById = async (req, res) => {
	try {
		const patient_id = req.params.id;
		const [rows] = await database.poolAdmin.query(
			"CALL getPatientById(?)",
			[patient_id]
		);
		res.json(rows[0]);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};

// Search patients by partial ID
const searchPatientsById = async (req, res) => {
	try {
		const id_search = req.query.id;
		const [rows] = await database.poolAdmin.query(
			"CALL searchPatientsById(?)",
			[`%${id_search}%`]
		);
		res.json(rows[0]);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};

// Search patients by partial name
const searchPatientsByName = async (req, res) => {
	try {
		const name_search = req.query.name;
		const [rows] = await database.poolAdmin.query(
			"CALL searchPatientsByName(?)",
			[`%${name_search}%`]
		);
		res.json(rows[0]);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};

// Create a new patient
const createPatient = async (req, res) => {
	try {
		const {
			first_name,
			last_name,
			birth_date,
			address,
			email,
			phone,
			allergies
		} = req.body;
		const [rows] = await database.poolAdmin.query(
			"CALL createPatient(?, ?, ?, ?, ?, ?, ?, @result)",
			[
				first_name,
				last_name,
				birth_date,
				address,
				email,
				phone,
				allergies
			]
		);
		const [result] = await database.poolAdmin.query("SELECT @result");
		const resultCode = result[0]["@result"];
		if (resultCode === 0) {
			res.json({
				message: "Patient created successfully",
				patient: rows[0]
			});
		} else if (resultCode === 1) {
			res.status(400).json({
				error: "Patient with this email and phone number already exist"
			});
		} else if (resultCode === 2) {
			res.status(400).json({ error: "Invalid argument value" });
		} else {
			res.status(400).json({ error: "Internal server error" });
		}
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};

// Update patient information
const updatePatient = async (req, res) => {
	try {
		const patient_id = req.params.id;
		const {
			first_name,
			last_name,
			birth_date,
			address,
			email,
			phone,
			allergies
		} = req.body;
		const [rows] = await database.poolAdmin.query(
			"CALL updatePatientInformation(?, ?, ?, ?, ?, ?, ?, ?, @result)",
			[
				patient_id,
				first_name,
				last_name,
				birth_date,
				address,
				email,
				phone,
				allergies
			]
		);
		const [result] = await database.poolAdmin.query("SELECT @result");
		const resultCode = result[0]["@result"];
		console.log(resultCode);
		console.log(result);
		if (resultCode === 0) {
			res.json({
				message: "Patient updated successfully",
				patient: rows[0]
			});
		} else if (resultCode === 1) {
			res.status(400).json({ error: "Patient not found" });
		} else if (resultCode === 2) {
			res.status(400).json({ error: "Invalid argument value" });
		} else {
			res.status(400).json({ error: "Internal server error" });
		}
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};

// Delete a patient
const deletePatient = async (req, res) => {
	try {
		const patient_id = req.params.id;
		const [rows] = await database.poolAdmin.query("CALL deletePatient(?)", [
			patient_id
		]);
		res.json({ message: "Patient deleted successfully", result: rows[0] });
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};

module.exports = {
	getAllPatients,
	getPatientById,
	searchPatientsById,
	searchPatientsByName,
	createPatient,
	updatePatient,
	deletePatient
};
