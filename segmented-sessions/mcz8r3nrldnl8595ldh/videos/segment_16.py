from manim import *

class AlgorithmAnimation(Scene):
    def construct(self):
        title = Text("Solving Complex Problems with Algorithms", font_size=36)
        self.play(Write(title))
        self.wait(2)

        proof_text = Text("Importance of Mathematical Proofs", font_size=28)
        proof_box = SurroundingRectangle(proof_text, color=BLUE)
        self.play(Write(proof_box), Write(proof_text))
        self.wait(3)

        algorithm_text = Text("Ensuring Correctness and Termination", font_size=28)
        self.play(FadeOut(proof_box), FadeOut(proof_text))
        self.play(Write(algorithm_text))
        self.wait(3)

        optimality_text = Text("Exploring Optimality in Algorithm Design", font_size=28)
        optimality_box = SurroundingRectangle(optimality_text, color=GREEN)
        self.play(FadeOut(algorithm_text), Write(optimality_box), Write(optimality_text))
        self.wait(3)

        power_dynamics_text = Text("Power Dynamics in Algorithm Design", font_size=28)
        power_dynamics_box = SurroundingRectangle(power_dynamics_text, color=RED)
        self.play(FadeOut(optimality_box), FadeOut(optimality_text))
        self.play(Write(power_dynamics_box), Write(power_dynamics_text))
        self.wait(3)

        conclusion_text = Text("Understanding These Ideas is Vital", font_size=28)
        self.play(FadeOut(power_dynamics_box), FadeOut(power_dynamics_text))
        self.play(Write(conclusion_text))
        self.wait(3)

        self.wait(10.8)  # Adjusting to ensure total duration is 24.8 seconds