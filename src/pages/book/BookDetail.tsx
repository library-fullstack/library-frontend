import * as React from "react";
import { useParams } from "react-router-dom";

export default function BookDetail(): React.ReactElement {
	const { id } = useParams();
	return <div>Book detail for {id ?? "(unknown)"} (placeholder)</div>;
}
