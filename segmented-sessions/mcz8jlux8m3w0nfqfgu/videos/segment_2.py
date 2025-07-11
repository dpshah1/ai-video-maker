from manim import *

class StableMatchingScene(Scene):
    def construct(self):

        title = Text("The Stable Matching Problem", font_size=48)
        self.play(Write(title))
        self.wait(1)

        algorithm_text = Text("Gale-Shapley Algorithm", font_size=36)
        self.play(Transform(title, algorithm_text))
        self.wait(1)

        residency_text = Text("Real-World Application: Residency Match Program", font_size=36)
        self.play(Transform(algorithm_text, residency_text))
        self.wait(1)

        modeling_text = Text("Importance of Carefully Modeling Situations", font_size=36)
        self.play(Transform(residency_text, modeling_text))
        self.wait(1)

        solution_text = Text("Algorithmic Solutions Can Be Proven Correct", font_size=36)
        self.play(Transform(modeling_text, solution_text))
        self.wait(1)

        fairness_text = Text("Fairness and Optimality in Matching", font_size=36)
        self.play(Transform(solution_text, fairness_text))
        self.wait(1)

        connection_text = Text("Connecting Abstract Algorithms to Practical Problems", font_size=36)
        self.play(Transform(fairness_text, connection_text))
        self.wait(1)

        implications_text = Text("Significant Implications for Society", font_size=36)
        self.play(Transform(connection_text, implications_text))
        self.wait(1)

        self.wait(10)  # Adjust to ensure total duration is 26 seconds