import React, { useState } from "react";
import {
  useDeleteAppointmentMutation,
  useGetAllAppointmentsQuery,
  useGetAllApprovedDoctorsQuery,
} from "../slices/userApiSlice";
import { Button, Card, Col, Row } from "react-bootstrap";
import moment from "moment";
import { BiTimeFive } from "react-icons/bi";
import Layout from "../components/Layout";
import NotFound from "../components/NotFound";
import { useSelector } from "react-redux";

import AppointmentsAsDoctor from "../components/AppointmentsAsDoctor";

export default function Appointments() {
  const { data } = useGetAllAppointmentsQuery();
  const [deleteAppointment, { data: deletedAppointment }] =
    useDeleteAppointmentMutation();
  const { data: doctors } = useGetAllApprovedDoctorsQuery();
  const { userInfo } = useSelector((state) => state.auth);

  if (data?.length === 0) return <NotFound>No Appointment Found!</NotFound>;

  const associate_doctor = (doctorId) => {
    const user = doctors?.find((doc) => doc._id == doctorId);
    return user?.user.name;
  };


  const payForAppointment = id =>{
    console.log(id)
  }
  
  return (
    <Layout>
      <h3>Appointments</h3> <hr />
      <Row>
        {userInfo?.isDoctor ? (
          <AppointmentsAsDoctor
            data={data}
            associate_doctor={associate_doctor}
            payForAppointment={payForAppointment}
          />
        ) : (
          data?.map((appointment) => {
            return (
              <Col key={appointment?._id} md={4}>
                <Card className="card my-4">
                  <Card.Body>
                    <Card.Title className="d-flex justify-content-between">
                      {associate_doctor(appointment?.doctor._id)}{" "}
                      <p className="badge bg-primary text-wrap">
                        {appointment.status}
                      </p>
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-muted text-uppercase">
                      {appointment?.doctor.expertise_in}
                    </Card.Subtitle>
                    <div>
                      <p>
                        Fee :{" "}
                        <span className="fw-bold">
                          {appointment?.doctor.fee}
                        </span>{" "}
                        TK
                      </p>{" "}
                      <p className="fw-light">
                        <BiTimeFive size={18} />{" "}
                        {moment(appointment?.time).format("hh:mm a")},{" "}
                        {appointment?.date}
                      </p>{" "}
                    </div>
                    <div className="text-center">
                     {!appointment.isPaid && <Button
                        onClick={() => deleteAppointment(appointment._id)}
                        className="btn-danger"
                      >
                        Cancel
                      </Button>}
                     {!appointment.isPaid && 
                     <Button onClick={() =>payForAppointment(appointment._id)} className="btn-primary">
                        Pay Now
                      </Button>}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })
        )}
      </Row>
    </Layout>
  );
}
