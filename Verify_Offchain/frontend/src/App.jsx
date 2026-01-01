import { VerificationLevel, IDKitWidget, useIDKit } from "@worldcoin/idkit";

export default function Home() {
  const app_id = import.meta.env.VITE_WLD_APP_ID;
  const action = import.meta.env.VITE_WLD_ACTION;

  if (!app_id) {
    throw new Error("VITE_WLD_APP_ID is not set");
  }
  if (!action) {
    throw new Error("VITE_WLD_ACTION is not set");
  }

  const { setOpen } = useIDKit();

  const onSuccess = (result) => {
    console.log(
      "Successfully verified with World ID! Your nullifier hash is: " +
      result.nullifier_hash
    );
  };

  const handleProof = async (result) => {
    try {
      const res = await fetch("http://localhost:4000/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          proof: {
            nullifier_hash: result.nullifier_hash,
            merkle_root: result.merkle_root,
            proof: result.proof,
            verification_level: result.verification_level,
          },
          signal: result.signal || null,
        }),
      });

      const data = await res.json();

      if (data.success) {
        console.log("Successful response from backend:\n", JSON.stringify(data));
      } else {
        console.error("Verification failed:", data);
        throw new Error(`Verification failed: ${data.detail}`);
      }
    } catch (err) {
      console.error("Error sending proof to backend:", err);
    }
  };


  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: "1.5rem", marginBottom: "1.25rem" }}>
          Verify Humanity Using World ID
        </p>

        <IDKitWidget
          action={action}
          app_id={app_id}
          onSuccess={onSuccess}
          handleVerify={handleProof}
          verification_level={VerificationLevel.Device}
        />

        <button
          style={{
            border: "1px solid black",
            borderRadius: "0.375rem",
            marginTop: "1rem",
            padding: "0.25rem 0.75rem",
            backgroundColor: "white",
            cursor: "pointer",
          }}
          onClick={() => setOpen(true)}
        >
          Verify
        </button>
      </div>
    </div>

  );
}
