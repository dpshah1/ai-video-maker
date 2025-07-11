from manim import *

class EvenDegreeTheorem(Scene):
    def construct(self):
        title = Text("The Even Degree Theorem", font_size=36).to_edge(UP)
        subtitle = Text("Unlocking Eulerian Tours", font_size=24).next_to(title, DOWN)

        theorem_text = Text("A graph has an Eulerian tour if all vertices have even degree.", font_size=20).scale(0.75).move_to(ORIGIN)

        self.play(Write(title))
        self.play(Write(subtitle))
        self.wait(0.5)

        self.play(Write(theorem_text))
        self.wait(3.1)

        self.clear()