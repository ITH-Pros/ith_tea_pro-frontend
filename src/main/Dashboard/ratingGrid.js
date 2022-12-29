import { MDBTooltip } from "mdb-react-ui-kit";
import { memo, useCallback, useState } from "react";
import { Link } from "react-router-dom";
import Modals from "../../components/modal";
import GetModalBody from "../../components/ModalBody";



const RatingGrid = memo((props) => {
  const { usersArray, ratingsArray, days, yearUse, monthUse, months } = props;

  const [modalShow, setModalShow] = useState(false);
  const [selectedRatingDetails, setSelectedRatingDetails] = useState({});



  function openShowCommentsModal(data) {
    console.log(data);
    setSelectedRatingDetails(data)
    setModalShow(true);
  }
  const handleDialogClose = useCallback(() => setModalShow(false), []);
  return (
    <>
      {
        usersArray.map((user, index) => {
          let userRatingSum = 0;
          let userRatingCount = 0;
          console.log(user)

          return (
            <tr key={index}>
              <td className="user_names"> {user.name}</td>
              {Array(days)
                ?.fill(0)
                ?.map((day, index) => {
                  let ratingUserObj = ratingsArray.find((el) => {
                    return el._id === user._id;
                  });
                  let ratingCommentObj = ratingUserObj?.ratingsAndComment.find(
                    (el) => el.date - 1 === index
                  );
                  if (ratingCommentObj) {
                    userRatingSum += ratingCommentObj?.rating;
                    userRatingCount += 1;

                    return (
                      <td key={index} >
                        <MDBTooltip
                          tag="a"
                          wrapperProps={{ href: "#" }}
                          title={"click to view details"}
                        >
                          <div
                            style={{
                              cursor: "pointer",
                              border: "1px solid grey",
                            }}
                            className="input_dashboard"
                            onClick={() =>
                              openShowCommentsModal(ratingCommentObj)
                            }
                          // onInput={(e) => handleChange(e, userIndex, dayIndex)}
                          >{`${ratingCommentObj?.rating}`}</div>
                        </MDBTooltip>
                      </td>
                    );
                  } else {
                    return (
                      <td key={index}>
                        <MDBTooltip
                          tag="p"
                          wrapperProps={{ href: "#" }}
                          title={"click to Add Rating"}
                        >

                          <Link to={{
                            pathname: "/rating",
                          }}
                            state={{ userId: user._id, date: `${yearUse}-${months.indexOf(monthUse) + 1}-${(index + 1) < 9 ? '0' + (index + 1) : index + 1}` }}>
                            <input
                              style={{ cursor: "pointer" }}
                              className="input_dashboard"
                              disabled={true}
                            />
                          </Link>
                        </MDBTooltip>
                      </td>

                    );
                  }
                })}

              <td className="userAverage">
                {userRatingCount
                  ? Math.round((userRatingSum / userRatingCount) * 100) /
                  100
                  : "NA"}
              </td>
            </tr>
          );
        })
      }
      <Modals
        modalShow={modalShow}
        modalBody={<GetModalBody selectedRatingDetails={selectedRatingDetails} />}
        heading="Rating Details"
        size="lg"
        btnContent="Close"
        onClick={handleDialogClose}
        onHide={handleDialogClose}
      />


    </>
  )
})
export default RatingGrid;
